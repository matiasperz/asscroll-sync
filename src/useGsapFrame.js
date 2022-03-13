import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'

export const useGsapFrame = (callback) => {
  const ref = useRef(callback)

  useLayoutEffect(() => void (ref.current = callback), [callback])

  useLayoutEffect(() => {
    gsap.ticker.add(callback)

    return () => gsap.ticker.remove(callback)
  }, [])

  return null
}
