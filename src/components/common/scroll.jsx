import React, { useRef } from 'react'

import { useGsapFrame } from '../../hooks/use-gsap-frame'
import { useASScroll } from './asscroll-context'

const Scroll = ({ children }) => {
  const [asscroll] = useASScroll()
  const groupRef = useRef()

  useGsapFrame(() => {
    groupRef.current.position.y = asscroll.scroll.currentPos
  })

  return <group ref={groupRef}>{children}</group>
}

export default Scroll
