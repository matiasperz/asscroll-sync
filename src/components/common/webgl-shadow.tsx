import { MeshProps } from '@react-three/fiber'
import React, { FC, HTMLProps, ReactChild, useEffect, useRef } from 'react'

import { useAppContext } from '~/context/app'

//import { useViewportSize } from '~/hooks/use-viewport'
import { WebGL } from './webgl'

type WebGLShadowProps = {
  visible: boolean
  shadowChildren: ReactChild
} & HTMLProps<HTMLDivElement>

/* WARNING: This sets the WebGL child size with the scale property, so make
            sure your children elements have a dimension of 1 on the
            horizontal axes. Otherwise the target size will be wrong.
*/

const WebGLShadow: FC<WebGLShadowProps> = ({
  shadowChildren,
  style,
  visible,
  children,
  ...rest
}) => {
  const meshRef = useRef<MeshProps>(null)
  const shadowRef = useRef<HTMLDivElement>(null)
  const { canvasLoaded } = useAppContext()
  //const viewport = useViewportSize()

  useEffect(() => {
    if (!canvasLoaded || !shadowRef.current) return

    const handleResize = () => {
      if (!shadowRef.current || !meshRef.current) return

      const { width, height, left, top } =
        shadowRef.current.getBoundingClientRect()

      //console.log({ width, height, left, top })

      meshRef.current.position.x = -window.innerWidth / 2 + left + width / 2
      meshRef.current.position.y = window.innerHeight / 2 - top - height / 2

      //console.log([meshRef.current.position.x, meshRef.current.position.y])

      meshRef.current.scale.x = width
      meshRef.current.scale.y = height
    }

    const observer = new ResizeObserver(handleResize)
    observer.observe(shadowRef.current)

    handleResize()

    return () => {
      observer.disconnect()
    }
  }, [canvasLoaded])

  return (
    <>
      <WebGL>
        <group ref={meshRef}>{children}</group>
      </WebGL>

      <div
        {...rest}
        style={{ border: visible ? '1px solid red' : 'none', ...style }}
        ref={shadowRef}
      >
        {shadowChildren}
      </div>
    </>
  )
}

export default WebGLShadow
