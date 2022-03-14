import { useContextBridge } from '@react-three/drei'
import { Canvas as R3FCanvas } from '@react-three/fiber'
import gsap from 'gsap'
import Stats from 'three/examples/jsm/libs/stats.module'

import { context as ASScrollContext } from './asscroll-context'
import Scroll from './scroll'
import { WebGLOut } from './webgl'

const cameraPosition = 800
const cameraFov =
  (180 * (2 * Math.atan(window.innerHeight / 2 / cameraPosition))) / Math.PI

export const Canvas = () => {
  const ContextBridge = useContextBridge(ASScrollContext)

  return (
    <div className="canvas-wrapper">
      <R3FCanvas
        onCreated={(state) => {
          const stats = new Stats()
          document.body.appendChild(stats.dom)

          gsap.ticker.add(() => {
            state.gl.render(state.scene, state.camera)
            stats.update()
          })
        }}
        frameloop="never"
        camera={{ position: [0, 0, cameraPosition], fov: cameraFov }}
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
