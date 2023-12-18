import type { AxiosError, AxiosInstance } from 'axios'
import axios, { HttpStatusCode } from 'axios'
import { toast } from 'react-hot-toast'
import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN, URL_REGISTER } from '../apis/auth.api'
import useGlobalStore from '../store/useGlobalStore'
import { ErrorResponse } from '../types/api.type'
import { AuthResponse, RefreshTokenReponse } from '../types/auth.type'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from './utils'
import config from './config'

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  private PREFIX = 'Bearer'
  private baseURL = config.baseUrl
  constructor() {
    this.accessToken = useGlobalStore.getState().accessToken
    this.refreshToken = useGlobalStore.getState().refreshToken
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 10,
        'expire-refresh-token': 60 * 60
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.authorization = this.PREFIX + ' ' + this.accessToken
        }
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === URL_LOGIN || url === URL_REGISTER) {
          this.accessToken = (response.data as AuthResponse).data.accessToken
          useGlobalStore.getState().setAccessToken(this.accessToken)
          this.refreshToken = (response.data as AuthResponse).data.refreshToken
          useGlobalStore.getState().setRefreshToken(this.refreshToken)
          useGlobalStore.getState().setProfile((response.data as AuthResponse).data.user)
        } else if (url === URL_LOGOUT) {
          this.accessToken = ''
          useGlobalStore.getState().setAccessToken('')
          this.refreshToken = ''
          useGlobalStore.getState().setRefreshToken('')
          useGlobalStore.getState().setProfile(null)
        }
        return response
      },
      (error: AxiosError) => {
        console.log('error', error)
        // Chỉ toast lỗi không phải 422 và 401
        if (
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          toast.error(message)
        }

        // Lỗi Unauthorized (401) có rất nhiều trường hợp
        // - Token không đúng
        // - Không truyền token
        // - Token hết hạn*

        // Nếu là lỗi 401
        if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
          const config = error.response?.config
          if (!config) return Promise.reject(error)

          const { url } = config
          // Trường hợp Token hết hạn và request đó không phải là của request refresh token
          // thì chúng ta mới tiến hành gọi refresh token
          if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
            // Hạn chế gọi 2 lần handleRefreshToken
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  // Giữ refreshTokenRequest trong 10s cho những request tiếp theo nếu có 401 thì dùng
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })
            return this.refreshTokenRequest.then((accessToken) => {
              // Nghĩa là chúng ta tiếp tục gọi lại request cũ vừa bị lỗi
              return this.instance({ ...config, headers: { ...config.headers, authorization: accessToken } })
            })
          }

          // Còn những trường hợp như token không đúng
          // không truyền token,
          // token hết hạn nhưng gọi refresh token bị fail
          // thì tiến hành xóa local storage và toast message

          this.accessToken = ''
          this.refreshToken = ''
          useGlobalStore.getState().setAccessToken('')
          useGlobalStore.getState().setRefreshToken('')

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          toast.error(message)
          window.location.assign('/login')
        }
        return Promise.reject(error)
      }
    )
  }

  private async handleRefreshToken() {
    return axios
      .post<RefreshTokenReponse>(
        URL_REFRESH_TOKEN,
        {},
        {
          baseURL: this.baseURL,
          headers: {
            Authorization: this.PREFIX + ' ' + this.refreshToken
          }
        }
      )
      .then((res) => {
        const { accessToken } = res.data.data
        useGlobalStore.getState().setAccessToken(accessToken)
        this.accessToken = accessToken
        return accessToken
      })
      .catch((error) => {
        this.accessToken = ''
        this.refreshToken = ''
        useGlobalStore.getState().setAccessToken('')
        useGlobalStore.getState().setRefreshToken('')
        useGlobalStore.getState().setProfile(null)
        throw error
      })
  }

  getCurrentAccessToken() {
    // this is how you access the zustand store outside of React.
    return useGlobalStore.getState().accessToken
  }

  getCurrentRefreshToken() {
    // this is how you access the zustand store outside of React.
    return useGlobalStore.getState().refreshToken
  }
}

const http = new Http().instance

export default http
