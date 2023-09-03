import { StateCreator, create } from 'zustand'
import { PersistOptions, persist } from 'zustand/middleware'

import { logger } from './logger'

interface GlobalState {
  accessToken: string
  setAccessToken: (token: string) => void
}
type MyPersist = (config: StateCreator<GlobalState>, options: PersistOptions<GlobalState>) => StateCreator<GlobalState>

const useGlobalStore = create<GlobalState>()(
  logger<GlobalState>(
    (persist as MyPersist)(
      (set) => ({
        accessToken: '',
        setAccessToken: (token) => set({ accessToken: token })
      }),
      {
        name: 'Shoppeee-storage'
      }
    ),
    'globalStore'
  )
)

export default useGlobalStore
