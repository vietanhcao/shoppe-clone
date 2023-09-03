import type { AxiosError, AxiosInstance } from 'axios'
import axios, { HttpStatusCode } from 'axios'
import { toast } from 'react-hot-toast'
import useGlobalStore from '../store/useGlobalStore'
import { AuthResponse } from '../types/auth.type'

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.accessToken = useGlobalStore.getState().accessToken
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.authorization = this.accessToken
        }
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        console.log('response', response)
        const { url } = response.config
        if (url === '/login' || url === '/register') {
          this.accessToken = (response.data as AuthResponse).data.access_token
          useGlobalStore.getState().setAccessToken(this.accessToken)
        } else if (url === '/logout') {
          this.accessToken = ''
          useGlobalStore.getState().setAccessToken('')
        }
        return response
      },
      (error: AxiosError) => {
        console.log('error', error)
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data?.message || 'Có lỗi xảy ra'
          toast.error(message)
        }
        return Promise.reject(error)
      }
    )
  }

  getCurrentAccessToken() {
    // this is how you access the zustand store outside of React.
    return useGlobalStore.getState().accessToken
  }

  // getCurrentRefreshToken() {
  //   // this is how you access the zustand store outside of React.
  //   return useGlobalStore.getState().refreshToken
  // }
}

const http = new Http().instance

export default http
