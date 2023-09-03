import { User } from './user.type'
import { SuccessResponseApi } from './api.type'

export type AuthResponse = SuccessResponseApi<{
  access_token: string
  expires: number
  user: User
}>
