import { useASScroll } from '@basementstudio/definitive-scroll'
import {
  useGsapFrame,
  useIntersect
} from '@basementstudio/definitive-scroll/hooks'
import { WebGL, WebGLShadow } from '@basementstudio/definitive-scroll/three'
import { Box } from '@react-three/drei'
import clsx from 'clsx'
import gsap from 'gsap'
import { useDeviceDetect } from 'hooks/use-device-detect'
import { useViewportSize } from 'hooks/use-viewport'
import { range } from 'lib/utils'
import React, {
  Fragment,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import { Meta } from '~/components/common/meta'
import { AspectBox } from '~/components/layout/aspect-box'
import { PageLayout } from '~/components/layout/page'

export const ThreeSquare = memo(({ idx }) => {
  const { scroll } = useASScroll()
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
    const scale = 1 - scroll.delta * 10
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
  const { scroll } = useASScroll()

  useGsapFrame(() => {
    if (!ref.current) return

    gsap.set(ref.current, {
      scale: 1 - scroll.delta * 10
    })
  })

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
  const { isReady } = useASScroll()

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

const InviewPlane = () => {
  const inViewRef = useIntersect((visible) =>
    console.log('Violet square is visible!', visible)
  )

  return (
    <mesh ref={inViewRef}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color="purple" />
    </mesh>
  )
}

const HomePage = () => {
  return (
    <PageLayout>
      <Meta />

      {/* WebGL tunnel Rat 🐀 */}
      <WebGL>
        {range(11).map((key) => {
          if (key === 10) {
            return <Fragment key={key} />
          }
          return <ThreeSquare idx={key} key={key} />
        })}
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
        Parallax Vertical
      </div>
      <HTMLSquare />

      <div style={{ width: '30%', margin: '0 auto', padding: '80px 0' }}>
        <WebGLShadow shadowChildren={<AspectBox ratio={1} />} visible>
          <Box
            position={[0, 0, -100]}
            scale={[1, 1, 200]}
            onClick={(event) => {
              event.eventObject.material.color.set('blue')
            }}
            onPointerOver={(event) => {
              event.eventObject.material.color.set('green')
            }}
            onPointerLeave={(event) => {
              event.eventObject.material.color.set('white')
            }}
          />
        </WebGLShadow>
      </div>

      <div
        className="square parallax horizontal"
        data-speed="-0.1"
        data-direction="horizontal"
      >
        Parallax Horizontal
      </div>
      <HTMLSquare />

      <WebGLShadow
        className="square"
        style={{
          background: 'transparent',
          marginLeft: '55vw',
          marginTop: '20px',
          marginBottom: '20px',
          color: 'white',
          fontSize: '2vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2%'
        }}
        shadowChildren={
          <p style={{ textAlign: 'center' }}>
            Oh, this? Just WebGL with an HTML shadow element. Impresive, right?
            (It still a bit buggy, I don't wanna lie lol)
          </p>
        }
        visible
      >
        <mesh>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="blue" />
        </mesh>
      </WebGLShadow>

      {/* <div style={{ width: '100%', padding: '0 40px', margin: '20px 0' }}>
        <WebGLShadow shadowChildren={<AspectBox ratio={1800 / 945} />} visible>
          {(ref) => <Image scale={[1800, 945, 1]} url="/og.png" ref={ref} />}
        </WebGLShadow>
      </div> */}

      <div style={{ width: '30%', margin: '0 auto', padding: '80px 0' }}>
        <WebGLShadow shadowChildren={<AspectBox ratio={1} />} visible>
          <InviewPlane />
        </WebGLShadow>
      </div>

      <HTMLSquare />
    </PageLayout>
  )
}

export default HomePage
