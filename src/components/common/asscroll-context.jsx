import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import * as THREE from 'three'

import { useViewportSize } from '~/hooks/use-viewport'
import { htmlParallax } from '~/lib/gsap'

import { useGsapFrame } from '../../hooks/use-gsap-frame'

export const context = createContext([])

export const useASScroll = () => {
  return useContext(context)
}

const DAMPING = 20

gsap.registerPlugin(ScrollTrigger)

export const ASSCrollProvider = ({ children }) => {
  const viewport = useViewportSize()
  const [isReady, setIsReady] = useState(false)
  const state = useRef({
    delta: 0,
    offset: 0,
    scroll: null
  })

  useEffect(() => {
    const targetElm = document.querySelector('[asscroll-container]')
    const enableAsscroll = (asscroll) => {
      const scrollElements = targetElm.querySelectorAll(
        '.gsap-marker-start, .gsap-marker-end, [asscroll]'
      )

      asscroll.disable()
      asscroll.enable({ newScrollElements: scrollElements })
    }

    if (!targetElm) return

    const ASScroll = require('@ashthornton/asscroll')

    state.current.scroll = new ASScroll({
      disableRaf: true,
      disableResize: true,
      ease: 0.125,
      containerElement: targetElm
    })

    const asscroll = state.current.scroll

    /* Setup resize observer */
    const resizeObserver = new ResizeObserver(() => {
      asscroll.resize()
      ScrollTrigger.refresh()
    })
    resizeObserver.observe(targetElm.children[0])

    /* Setup children mutation observer to fix gsap scroll-trigger markers issue */
    const mutationObserver = new MutationObserver(() =>
      enableAsscroll(asscroll)
    )
    mutationObserver.observe(targetElm, { childList: true })

    /* Add scroll update to gsap ticker */
    gsap.ticker.add(asscroll.update)

    /* Scroll trigger setup */
    ScrollTrigger.defaults({
      scroller: asscroll.containerElement
    })

    ScrollTrigger.scrollerProxy(asscroll.containerElement, {
      scrollTop(value) {
        return arguments.length
          ? (asscroll.currentPos = value)
          : asscroll.currentPos
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        }
      },
      fixedMarkers: true
    })

    asscroll.on('update', ScrollTrigger.update)
    ScrollTrigger.addEventListener('refresh', asscroll.resize)

    enableAsscroll(asscroll)

    setIsReady(true)

    return () => {
      gsap.ticker.remove(asscroll.update)
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  /* Setup parallax */
  useEffect(() => {
    if (!isReady) return

    const totalScroll =
      state.current.scroll.containerElement.scrollHeight - viewport.height
    const parallaxElements = document.querySelectorAll('[data-speed]')

    const tweens = []

    parallaxElements.forEach((elm) => {
      tweens.push(htmlParallax(totalScroll, elm))
    })

    return () => {
      tweens.forEach((tween) => tween.kill())
    }
  }, [isReady, viewport.height])

  let last = 0

  useGsapFrame((time, deltaTime) => {
    if (!state.current.scroll) return

    const _state = state.current

    const asscroll = _state.scroll
    const deltaMs = deltaTime / 1000
    const scrollProgress = asscroll.currentPos / asscroll.maxScroll

    _state.offset = THREE.MathUtils.damp(
      (last = _state.offset),
      scrollProgress,
      DAMPING,
      deltaMs
    )
    _state.delta = THREE.MathUtils.damp(
      _state.delta,
      Math.abs(last - _state.offset),
      DAMPING,
      deltaMs
    )
  })

  return (
    <context.Provider value={[state.current, isReady]}>
      {children}
    </context.Provider>
  )
}
