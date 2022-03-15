import dynamic from 'next/dynamic'

const Canvas = dynamic(
  //@ts-ignore
  () => import('../common/canvas').then((mod) => mod.Canvas),
  { ssr: false }
)

import { Container, ContainerProps } from './container'

type Props = {
  children?: React.ReactNode
  contain?: boolean | ContainerProps

  // TODO after implementing header, footer
  // headerProps?: HeaderProps
  // footerProps?: FooterProps
}

export const PageLayout = ({ children, contain }: Props) => {
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
