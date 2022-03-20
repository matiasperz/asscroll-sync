import { ScrollContext } from '@basement.studio/definitive-scroll'
import { useContextBridge } from '@react-three/drei'
import { Canvas as R3FCanvas } from '@react-three/fiber'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import Stats from 'three/examples/jsm/libs/stats.module'

import { useAppContext } from '~/context/app'
import { useViewportSize } from '~/hooks/use-viewport'

import Scroll from './scroll'
import { WebGLOut } from './webgl'

const CAMERA_DISTANCE = 800
const calcCameraFov = () =>
  (180 * (2 * Math.atan(window.innerHeight / 2 / CAMERA_DISTANCE))) / Math.PI

export const Canvas = () => {
  const ContextBridge = useContextBridge(ScrollContext)
  const { width, height } = useViewportSize()
  const { setCanvasLoaded } = useAppContext()
  const camera = useRef(null)

  useEffect(() => {
    if (!camera.current || !height || !width) return

    camera.current.fov = calcCameraFov()

    camera.current.updateProjectionMatrix()
  }, [width, height])

  return (
    <div className="canvas-wrapper">
      <R3FCanvas
        onCreated={(state) => {
          const stats = new Stats()
          document.body.appendChild(stats.dom)

          camera.current = state.camera
          setCanvasLoaded(true)

          gsap.ticker.add(() => {
            state.gl.render(state.scene, state.camera)
            stats.update()
          })
        }}
        frameloop="never"
        camera={{ position: [0, 0, CAMERA_DISTANCE], fov: calcCameraFov() }}
      >
        <color attach="background" args={['#000']} />
        <ContextBridge>
          <Scroll>
            <WebGLOut />
          </Scroll>
        </ContextBridge>
      </R3FCanvas>
    </div>
  )
}
