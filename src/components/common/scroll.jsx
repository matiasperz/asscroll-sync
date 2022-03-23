import { useASScroll } from '@basementstudio/definitive-scroll'
import React, { useRef } from 'react'

import { useGsapFrame } from '../../hooks/use-gsap-frame'

const Scroll = ({ children }) => {
  const { scroll } = useASScroll()
  const groupRef = useRef()

  useGsapFrame(() => {
    groupRef.current.position.y = scroll.scroll.currentPos
  })

  return <group ref={groupRef}>{children}</group>
}

export default Scroll
