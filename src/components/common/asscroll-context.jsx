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

import { useGsapFrame } from '../../hooks/use-gsap-frame'

export const context = createContext([])

export const useASScroll = () => {
  return useContext(context)
}

const DAMPING = 20

export const ASSCrollProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false)
  const asscrollInstance = useRef(null)
  const state = useRef({
    delta: 0,
    offset: 0,
    scroll: asscrollInstance
  })

  useEffect(() => {
    const targetElm = document.querySelector('[data-asscroll-container]')

    if (!targetElm) return

    const ASScroll = require('@ashthornton/asscroll')

    asscrollInstance.current = new ASScroll({
      disableRaf: true,
      ease: 0.125,
      containerElement: targetElm
    })

    const asscroll = asscrollInstance.current

    gsap.ticker.add(asscroll.update)

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
      }
    })

    asscroll.on('update', ScrollTrigger.update)
    ScrollTrigger.addEventListener('refresh', asscroll.resize)

    asscroll.enable()
    setIsReady(true)
  }, [])

  let last = 0

  useGsapFrame((time, deltaTime) => {
    if (!asscrollInstance.current) return

    const _state = state.current

    const asscroll = asscrollInstance.current
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
