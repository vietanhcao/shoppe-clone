import { create } from 'zustand'
import { logger } from './logger'
import { getItem, setItem } from '../libs/localStorage'

interface GlobalState {
  isAuthenticated: boolean
  setIsAuthenticated: (isAuth: boolean) => void
}

const useGlobalStore = create<GlobalState>()(
  logger<GlobalState>(
    (set) => ({
      isAuthenticated: false,
      setIsAuthenticated: (isAuth) => set({ isAuthenticated: isAuth })
    }),
    'globalStore'
  )
)

export default useGlobalStore
