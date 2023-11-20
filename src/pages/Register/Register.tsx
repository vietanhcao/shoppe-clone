import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
// không có tính năng tree-shaking
import omit from 'lodash/omit'
import authApi from '../../apis/auth.api'
import Input from '../../components/Input'
import { Schema, schema } from '../../libs/rules'
import { isAxiosUnprocessableEntityError } from '../../libs/utils'
import { ErrorResponse } from '../../types/api.type'
import Button from '../../components/Button/Button'
import pathUrl from '../../constants/pathUrl'
import { Helmet } from 'react-helmet-async'

const registerSchema = schema.pick(['email', 'password', 'confirm_password'])

type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>

export default function Register() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })

  const regtisterAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
  })

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const body = omit(data, ['confirm_password'])
    regtisterAccountMutation.mutate(body, {
      onSuccess: () => {
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<Schema, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          // todo use for loop to set error
          if (formError?.email) {
            setError('email', {
              message: formError.email,
              type: 'server'
            })
          }
        }
      }
    })
  }
  console.log('error', errors)
  return (
    <div className='bg-orange'>
      <Helmet>
        <title>Đăng ký | Shopee Clone</title>
        <meta name='description' content='Đăng ký tài khoản vào dự án Shopee Clone' />
      </Helmet>
      <div className='mx-auto max-w-7xl px-4'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className='text-2xl'>Đăng ký</div>
              <Input
                type='email'
                name='email'
                placeholder='Email'
                register={register}
                errorMessage={errors.email?.message}
                classNameBoundary='mt-8'
              />
              <Input
                type='password'
                name='password'
                placeholder='Password'
                register={register}
                errorMessage={errors.password?.message}
                classNameBoundary='mt-2'
              />

              <Input
                type='password'
                name='confirm_password'
                placeholder='Confirm password'
                register={register}
                errorMessage={errors.confirm_password?.message}
                classNameBoundary='mt-2'
                autoComplete='on'
              />
              <div className='mt-2'>
                <Button
                  type='submit'
                  className='w-full bg-red-500 px-2 py-4 text-center text-sm uppercase text-white hover:bg-red-600'
                  isLoading={regtisterAccountMutation.isLoading}
                  disabled={regtisterAccountMutation.isLoading}
                >
                  Đăng ký
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center '>
                <span className='text-slate-300'>Bạn đã có tài khoản?</span>
                <Link to={pathUrl.login} className='ml-2 text-red-400'>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
