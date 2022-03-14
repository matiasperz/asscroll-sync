import gsap from 'gsap'
import { useLayoutEffect, useRef } from 'react'

export const useGsapFrame = (callback) => {
  const ref = useRef(callback)

  useLayoutEffect(() => void (ref.current = callback), [callback])

  useLayoutEffect(() => {
    gsap.ticker.add(callback)

    return () => gsap.ticker.remove(callback)
  }, [])

  return null
}
