import * as React from 'react'

export const useReactId = () => {
  return (React as any).useId() as string
}
