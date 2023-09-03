import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import { omit } from 'lodash'
import { registerAccount } from '../../apis/auth.api'
import Input from '../../components/Input'
import { Schema, schema } from '../../libs/rules'
import { isAxiosUnprocessableEntityError } from '../../libs/utils'
import { ErrorResponse } from '../../types/api.type'
import Button from '../../components/Button/Button'
import pathUrl from '../../constants/pathUrl'

export default function Register() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<Schema>({
    resolver: yupResolver(schema)
  })

  const regtisterAccountMutation = useMutation({
    mutationFn: (body: Omit<Schema, 'confirm_password'>) => registerAccount(body)
  })

  const onSubmit: SubmitHandler<Schema> = (data) => {
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
  return (
    <div className='bg-orange'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded bg-white shadow-sm' onSubmit={handleSubmit(onSubmit)} noValidate>
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
                  className='w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600'
                  isLoading={regtisterAccountMutation.isLoading}
                  disabled={regtisterAccountMutation.isLoading}
                >
                  Đăng ký
                </Button>
              </div>
              <div className='flex items-center justify-center mt-8 '>
                <span className='text-slate-300'>Bạn đã có tài khoản?</span>
                <Link to={pathUrl.login} className='text-red-400 ml-2'>
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
