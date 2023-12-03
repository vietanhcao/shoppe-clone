import { User } from './user.type'
import { SuccessResponse } from './api.type'

export type AuthResponse = SuccessResponse<{
  accessToken: string
  expires: number
  refreshToken: string
  expires_refresh_token: number
  user: User
}>

export type RefreshTokenReponse = SuccessResponse<{ accessToken: string }>
