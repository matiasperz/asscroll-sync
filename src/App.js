import React, { useEffect, useRef } from "react";
import { Canvas as R3FCanvas } from '@react-three/fiber'
import { OrbitControls, useContextBridge } from '@react-three/drei'
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh
} from "three";
import Stats from 'three/examples/jsm/libs/stats.module'

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { WebGL, WebGLOut } from './WebGL'

import "./styles.css";
import { ASSCrollProvider, useASScroll, context as ASScrollContext } from "./ASScrollContext";
import Scroll from './Scroll'
import { useGsapFrame } from "./useGsapFrame";

const squaresAmount = 10;

gsap.registerPlugin(ScrollTrigger);

const initThreeJS = (asscroll) => {
  const canvas = document.querySelector("canvas");

  const renderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  const scene = new Scene();
  const cameraPosition = 800;
  const fov =
    (180 * (2 * Math.atan(window.innerHeight / 2 / cameraPosition))) / Math.PI;
  const camera = new PerspectiveCamera(
    fov,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.set(0, 0, cameraPosition);

  const planeSize = window.innerWidth * 0.45;
  const geometry = new PlaneGeometry(planeSize, planeSize);
  const material = new MeshBasicMaterial({
    color: "red"
  });
  
  const planes = []

  for (let i = 0; i < squaresAmount; i++) {
    const margin = 20;

    const plane = new Mesh(geometry, material);
    plane.scale.set(planeSize, planeSize, 1);
    let planeOrigY =
      -planeSize / 2 - planeSize * i - margin * i + window.innerHeight / 2;
    plane.position.y = planeOrigY;
    plane.position.x = -planeSize / 2 + window.innerWidth / 2;
    scene.add(plane);
    planes.push(plane);
  }

  const render = function () {
    camera.position.y = -asscroll.scroll.current.currentPos;
    const scale = 1 - (asscroll.delta * 10)

    planes.forEach((p) => {
      p.scale.set(scale, scale, 1)
    })

    renderer.render(scene, camera);
  };

  gsap.ticker.add(render);
};

const Layout = ({ children }) => {
  return (
    <ASSCrollProvider>
      <Canvas />
      <div style={{ position: "relative" }}>
        <div data-asscroll-container>
          <div data-asscroll>{children}</div>
        </div>
        <div className="asscrollbar">
          <div className="asscrollbar__handle">
            <div></div>
          </div>
        </div>
      </div>
    </ASSCrollProvider>
  );
};

const margin = 20;
const planeSize = window.innerWidth * 0.45;
const geometry = new PlaneGeometry(planeSize, planeSize);
const material = new MeshBasicMaterial({
  color: "red"
});

const ThreeSquare = ({ idx }) => {
  const [asscroll] = useASScroll();
  const meshRef = useRef(null);

  useEffect(() => {
    const plane = meshRef.current

    let planeOrigY =
      -planeSize / 2 - planeSize * idx - margin * idx + window.innerHeight / 2;
    plane.position.y = planeOrigY;
    plane.position.x = -planeSize / 2 + window.innerWidth / 2;
  }, [])

  useGsapFrame(() => {
    const scale = 1 - (asscroll.delta * 10)
    meshRef.current.scale.set(scale, scale, 1)
  })

  return <mesh geometry={geometry} material={material} ref={meshRef} />
}

const HTMLSquare = () => {
  const ref = useRef(null);
  const [asscroll, isReady] = useASScroll();

  useEffect(() => {
    if(!isReady || !ref.current) return
    
    gsap.ticker.add(() => {
      gsap.set(ref.current, {
        scale: 1 - (asscroll.delta * 10)
      })
    })
  }, [isReady])

  return (
    <div className="square" ref={ref} />
  )
}

const cameraPosition = 800;
const cameraFov = (180 * (2 * Math.atan(window.innerHeight / 2 / cameraPosition))) / Math.PI;

const stats = new Stats()
document.body.appendChild(stats.dom)

const Canvas = () => {
  const ContextBridge = useContextBridge(ASScrollContext)

  return (
    <div className="canvas-wrapper">
      <R3FCanvas onCreated={(state) => {
        gsap.ticker.add(() => {
          state.gl.render(state.scene, state.camera);
          stats.update()
        })
      }} frameloop="never" camera={{ position: [0, 0, cameraPosition], fov: cameraFov }}>
        <color attach="background" args={["#000"]} />
        <OrbitControls />
        <ContextBridge>
          <Scroll>
            <WebGLOut />
          </Scroll>
        </ContextBridge>
      </R3FCanvas>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Layout>
        <WebGL>
          {[...Array(squaresAmount).keys()].map((key) => (
            <ThreeSquare idx={key} key={key} />
          ))}
        </WebGL>
        {[...Array(squaresAmount).keys()].map((key) => (
          <HTMLSquare key={key} />
        ))}
      </Layout>
    </>
  );
}
