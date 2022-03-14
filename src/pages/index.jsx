import { useThree } from '@react-three/fiber'
import clsx from 'clsx'
import { useASScroll } from 'components/common/asscroll-context'
import { WebGL } from 'components/common/webgl'
import gsap from 'gsap'
import { useGsapFrame } from 'hooks/use-gsap-frame'
import { range } from 'lib/utils'
import React, { memo, useEffect, useMemo, useRef, useState } from 'react'

import { Meta } from '~/components/common/meta'
import { PageLayout } from '~/components/layout/page'

export const ThreeSquare = memo(({ idx }) => {
  const [asscroll] = useASScroll()
  const { viewport } = useThree()
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
        -planeSize / 2 -
          viewport.width * 0.45 * idx -
          margin * idx +
          viewport.height / 2,
        0
      ]}
      ref={meshRef}
    >
      <planeGeometry args={[viewport.width * 0.45, viewport.width * 0.45]} />
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
      {range(5).map((key) => (
        <HTMLSquare key={key} />
      ))}
      <Spacer />
      {range(5).map((key) => (
        <HTMLSquare key={key} />
      ))}
    </PageLayout>
  )
}

export default HomePage
