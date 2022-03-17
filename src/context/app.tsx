import * as React from 'react'

export interface State {
  canvasLoaded: boolean
  fontsLoaded: boolean
}

const initialState = {
  canvasLoaded: false,
  fontsLoaded: false
}

type Action =
  | {
      type: 'SET_CANVAS_LOADED'
    }
  | {
      type: 'SET_FONTS_LOADED'
    }

export const AppContext = React.createContext<State | any>(initialState)

function uiReducer(state: State, action: Action) {
  /* Rule: {action}_{context} */
  switch (action.type) {
    case 'SET_CANVAS_LOADED': {
      return {
        ...state,
        canvasLoaded: true
      }
    }
    case 'SET_FONTS_LOADED': {
      return {
        ...state,
        fontsLoaded: true
      }
    }
  }
}

export const AppContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(uiReducer, initialState)

  const setCanvasLoaded = React.useCallback(
    () => dispatch({ type: 'SET_CANVAS_LOADED' }),
    [dispatch]
  )

  const setFontsLoaded = React.useCallback(
    () => dispatch({ type: 'SET_FONTS_LOADED' }),
    [dispatch]
  )

  const value = React.useMemo(
    () => ({
      ...state,
      setCanvasLoaded,
      setFontsLoaded
    }),
    [state]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const context = React.useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within a AppContextProvider')
  }
  return context
}
