import { useEffect, useRef, useState } from 'react'

const CALL_THRESHOLD_MS = 500

export const useViewportSize = () => {
  const resizeTimeout = useRef<NodeJS.Timeout | null>(null)
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined
    height: number | undefined
  }>({
    width: 0,
    height: undefined
  })

  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current)
      }
      resizeTimeout.current = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }, CALL_THRESHOLD_MS)
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)

      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current)
      }
    }
  }, [])

  return windowSize
}