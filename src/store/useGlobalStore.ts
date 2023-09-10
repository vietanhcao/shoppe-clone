import { StateCreator, create } from 'zustand'
import { PersistOptions, persist } from 'zustand/middleware'

import { logger } from './logger'
import { User } from '../types/user.type'

interface GlobalState {
  accessToken: string
  setAccessToken: (token: string) => void
  refreshToken: string
  setRefreshToken: (token: string) => void
  profile: User | null
  setProfile: (profile: User | null) => void
}
type MyPersist = (config: StateCreator<GlobalState>, options: PersistOptions<GlobalState>) => StateCreator<GlobalState>

const useGlobalStore = create<GlobalState>()(
  logger<GlobalState>(
    (persist as MyPersist)(
      (set) => ({
        accessToken: '',
        refreshToken: '',
        profile: null,
        setAccessToken: (token) => set({ accessToken: token }),
        setRefreshToken: (token) => set({ refreshToken: token }),
        setProfile: (profile) => set({ profile: profile })
      }),
      {
        name: 'Shoppeee-storage'
      }
    ),
    'globalStore'
  )
)

export default useGlobalStore
