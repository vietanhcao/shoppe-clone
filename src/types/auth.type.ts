import { User } from './user.type'
import { SuccessResponse } from './api.type'

export type AuthResponse = SuccessResponse<{
  access_token: string
  expires: number
  user: User
}>
