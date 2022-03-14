import { useASScroll } from 'components/common/asscroll-context'
import { WebGL } from 'components/common/webgl'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import { useGsapFrame } from 'hooks/use-gsap-frame'
import { range } from 'lib/utils'
import React, { useEffect, useMemo, useRef } from 'react'
import { MeshBasicMaterial, PlaneGeometry } from 'three'

import { Meta } from '~/components/common/meta'
import { PageLayout } from '~/components/layout/page'

const squaresAmount = 10

gsap.registerPlugin(ScrollTrigger)

const ThreeSquare = ({ idx }) => {
  const [asscroll] = useASScroll()
  const meshRef = useRef(null)

  const { planeSize, margin, geometry, material } = useMemo(() => {
    const margin = 20
    const planeSize = window.innerWidth * 0.45
    const geometry = new PlaneGeometry(planeSize, planeSize)
    const material = new MeshBasicMaterial({
      color: 'red'
    })

    return {
      margin,
      planeSize,
      geometry,
      material
    }
  }, [])

  useEffect(() => {
    const plane = meshRef.current

    let planeOrigY =
      -planeSize / 2 - planeSize * idx - margin * idx + window.innerHeight / 2
    plane.position.y = planeOrigY
    plane.position.x = -planeSize / 2 + window.innerWidth / 2
  }, [idx])

  useGsapFrame(() => {
    const scale = 1 - asscroll.delta * 10
    meshRef.current.scale.set(scale, scale, 1)
  })

  return <mesh geometry={geometry} material={material} ref={meshRef} />
}

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

const HomePage = () => {
  return (
    <PageLayout>
      <Meta />

      <WebGL>
        {' '}
        {/* WebGL tunnel Rat 🐀 */}
        {range(squaresAmount).map((key) => (
          <ThreeSquare idx={key} key={key} />
        ))}
      </WebGL>

      {/* Just simple HTML */}
      {range(squaresAmount).map((key) => (
        <HTMLSquare key={key} />
      ))}
    </PageLayout>
  )
}

export default HomePage
