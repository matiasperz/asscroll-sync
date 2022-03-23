import type { Canvas as TCanvas } from '@basementstudio/definitive-scroll/three'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

import { AppContext, useAppContext } from '~/context/app'

const Canvas = dynamic(
  //@ts-ignore
  () =>
    import('@basementstudio/definitive-scroll/three').then((mod) => mod.Canvas),
  { ssr: false }
) as typeof TCanvas

import { Container, ContainerProps } from './container'

type Props = {
  children?: React.ReactNode
  contain?: boolean | ContainerProps
}

export const PageLayout = ({ children, contain }: Props) => {
  const { setFontsLoaded, setCanvasLoaded } = useAppContext()

  useEffect(() => {
    try {
      document.fonts.ready
        .then(() => {
          setFontsLoaded()
        })
        .catch((error: unknown) => {
          console.error(error)
          setFontsLoaded()
        })
    } catch (error) {
      console.error(error)
      setFontsLoaded()
    }
  }, [setFontsLoaded])

  return (
    <>
      {/* TODO Header */}
      {/* <Header /> */}
      <Canvas onCreated={setCanvasLoaded} forwardContext={[AppContext]} debug />
      <div style={{ position: 'relative' }}>
        <div asscroll-container="true">
          <div>
            <main style={{ position: 'relative' }}>
              {contain ? (
                <Container {...contain}>{children}</Container>
              ) : (
                children
              )}
            </main>
          </div>
        </div>
        <div className="asscrollbar">
          <div className="asscrollbar__handle">
            <div></div>
          </div>
        </div>
      </div>
      {/* TODO Footer */}
      {/* <Footer /> */}
    </>
  )
}
