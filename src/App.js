import React, { useEffect } from "react";
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh
} from "three";

import ASScroll from "@ashthornton/asscroll";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import "./styles.css";
import { ASSCrollProvider, useASScroll } from "./ASScrollContext";

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

  const geometry = new PlaneGeometry();
  const material = new MeshBasicMaterial({
    color: "red"
  });

  const planeSize = window.innerWidth * 0.45;
  
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
    const scale = (-asscroll.delta * 4000) + planeSize

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
      <div style={{ position: "relative", zIndex: 10 }}>
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

const ThreeSquares = () => {
  const [asscroll, isReady] = useASScroll();

  useEffect(() => {
    if(!isReady) return
    
    initThreeJS(asscroll)

  }, [isReady])

  return <></>
}

export default function App() {
  return (
    <Layout>
      {[...Array(squaresAmount).keys()].map((key) => (
        <div className="square" key={key} />
      ))}
      <ThreeSquares />
    </Layout>
  );
}
