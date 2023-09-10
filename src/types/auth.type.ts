import { User } from './user.type'
import { SuccessResponse } from './api.type'

export type AuthResponse = SuccessResponse<{
  access_token: string
  expires: number
  refresh_token: string
  expires_refresh_token: number
  user: User
}>

export type RefreshTokenReponse = SuccessResponse<{ access_token: string }>
