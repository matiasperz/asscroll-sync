import clsx from 'clsx'
import { useASScroll } from 'components/common/asscroll-context'
import { WebGL } from 'components/common/webgl'
import gsap from 'gsap'
import { useDeviceDetect } from 'hooks/use-device-detect'
import { useGsapFrame } from 'hooks/use-gsap-frame'
import { useViewportSize } from 'hooks/use-viewport'
import { range } from 'lib/utils'
import React, { memo, useEffect, useMemo, useRef, useState } from 'react'

import { Meta } from '~/components/common/meta'
import { PageLayout } from '~/components/layout/page'

export const ThreeSquare = memo(({ idx }) => {
  const [asscroll] = useASScroll()
  const viewport = useViewportSize()
  const meshRef = useRef(null)

  const { planeSize, margin } = useMemo(() => {
    const margin = 20
    const planeSize = viewport.width * 0.45

    return {
      margin,
      planeSize
    }
  }, [viewport.width])

  useGsapFrame(() => {
    const scale = 1 - asscroll.delta * 10
    meshRef.current.scale.set(scale, scale, 1)
  })

  return (
    <mesh
      position={[
        -planeSize / 2 + viewport.width / 2,
        -planeSize / 2 - planeSize * idx - margin * idx + viewport.height / 2,
        0
      ]}
      ref={meshRef}
    >
      <planeGeometry args={[planeSize, planeSize]} />
      <meshBasicMaterial color="red" />
    </mesh>
  )
})

const HTMLSquare = () => {
  const ref = useRef(null)
  const [asscroll, isReady] = useASScroll()

  useEffect(() => {
    if (!isReady || !ref.current) return

    gsap.ticker.add(() => {
      gsap.set(ref.current, {
        scale: 1 - asscroll.delta * 10
      })
    })
  }, [isReady])

  return <div className="square" ref={ref} />
}

const Spacer = () => {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={clsx('spacer', { open: open })}
      onClick={() => {
        setOpen((state) => !state)
      }}
    >
      <p>CLICK ME!</p>
    </div>
  )
}

const Trigger = () => {
  const { isDesktop } = useDeviceDetect()
  const overpageRef = useRef(null)
  const [, isReady] = useASScroll()

  useEffect(() => {
    if (!overpageRef.current || !isReady || isDesktop === undefined) return

    const tween = gsap.to(overpageRef.current, {
      scrollTrigger: {
        trigger: overpageRef.current.parentElement,
        scrub: true,
        ...(isDesktop
          ? { start: 'top 50%', end: 'bottom 85%' }
          : { start: 'top 50%', end: 'bottom 50%' }),
        markers: true
      },
      width: '100%',
      //duration: 5,
      ease: 'linear'
    })

    return () => {
      tween.kill()
    }
  }, [isReady, isDesktop])

  return (
    <div className="overpage-trigger">
      <div className="overpage" ref={overpageRef}>
        <h1>With scroll trigger 🔥</h1>
      </div>
    </div>
  )
}

const HomePage = () => {
  return (
    <PageLayout>
      <Meta />

      <WebGL>
        {/* WebGL tunnel Rat 🐀 */}
        {range(11).map((key) => (
          <ThreeSquare idx={key} key={key} />
        ))}
      </WebGL>

      {/* Just simple HTML */}
      {range(2).map((key) => (
        <HTMLSquare key={key} />
      ))}
      <Spacer />
      {range(2).map((key) => (
        <HTMLSquare key={key} />
      ))}
      <Trigger />
      {range(2).map((key) => (
        <HTMLSquare key={key} />
      ))}
      <div className="square parallax" data-speed="0.1">
        Parallax
      </div>
      {range(2).map((key) => (
        <HTMLSquare key={key} />
      ))}
    </PageLayout>
  )
}

export default HomePage
