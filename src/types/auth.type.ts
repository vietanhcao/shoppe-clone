import { User } from './user.type'
import { ResponseApi } from './api.type'

export type AuthResponse = ResponseApi<{
  access_token: string
  expires: number
  user: User
}>
