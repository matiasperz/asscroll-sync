import dynamic from 'next/dynamic'
import { useEffect } from 'react'

import { useAppContext } from '~/context/app'

const Canvas = dynamic(
  //@ts-ignore
  () => import('../common/canvas').then((mod) => mod.Canvas),
  { ssr: false }
)

import { Container, ContainerProps } from './container'

type Props = {
  children?: React.ReactNode
  contain?: boolean | ContainerProps
}

export const PageLayout = ({ children, contain }: Props) => {
  const { setFontsLoaded } = useAppContext()

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
      <Canvas />
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
