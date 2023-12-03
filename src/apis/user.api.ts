import { User } from 'src/types/user.type'
import { SuccessResponse } from '../types/api.type'
import http from '../libs/http'

interface BodyUpdateProfile extends Omit<User, '_id' | 'roles' | 'createdAt' | 'updatedAt' | 'email'> {
  password?: string
  newPassword?: string
}

const userApi = {
  getProfile() {
    return http.get<SuccessResponse<User>>('auth/me')
  },
  updateProfile(body: BodyUpdateProfile) {
    return http.put<SuccessResponse<User>>('users', body)
  },
  updatePassword(body: BodyUpdateProfile) {
    return http.put<SuccessResponse<User>>('auth/change-password', body)
  },
  uploadAvatar(body: FormData) {
    return http.post<SuccessResponse<{ filename: string }>>('users/upload-avatar', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default userApi
