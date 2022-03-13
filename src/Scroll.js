import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber'

import { useASScroll } from './ASScrollContext'

const Scroll = ({ children }) => {
  const [asscroll, isReady] = useASScroll()
  const groupRef = useRef()

  useFrame(() => {
    groupRef.current.position.y = asscroll.scroll.current.currentPos
  })

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
};

export default Scroll;