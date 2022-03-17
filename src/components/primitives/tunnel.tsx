import React, { memo, useLayoutEffect } from 'react'
import create from 'zustand'

import { useReactId } from '~/hooks/use-react-id'

type Props = { children?: React.ReactNode | null }
type State = {
  current: Record<string, React.ReactNode>
  pushChildren: (children: State['current']) => void
}

export default function tunnel() {
  const useStore = create<State>((set) => ({
    current: {},
    pushChildren: (children) => {
      set((state) => {
        const result = Object.assign(state.current, children)
        return { current: result }
      })
    }
  }))

  return {
    In: memo(({ children }: Props) => {
      const { pushChildren } = useStore((state) => state)
      const id = useReactId()

      useLayoutEffect(() => {
        if (children === null || children === undefined) return

        const newChildren: State['current'] = {}

        if (Array.isArray(children)) {
          children.forEach((child) => {
            newChildren[id + (child?.key ? child?.key : '')] = child
          })
        } else {
          newChildren[id] = children
        }

        pushChildren(newChildren)
      }, [children, pushChildren, id])

      return null
    }),
    Out: () => {
      const current = useStore((state) => state.current)
      return Object.values(current)
    }
  }
}
