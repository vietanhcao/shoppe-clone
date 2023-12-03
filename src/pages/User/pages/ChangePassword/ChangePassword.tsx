import { useForm } from 'react-hook-form'
import Button from '../../../../components/Button/Button'
import Input from '../../../../components/Input/Input'
import { UserSchema, userSchema } from '../../../../libs/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import userApi from '../../../../apis/user.api'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { isAxiosUnprocessableEntityError } from '../../../../libs/utils'
import { ErrorResponse } from '../../../../types/api.type'
import omit from 'lodash/omit'

type FormData = Pick<UserSchema, 'password' | 'new_password' | 'confirm_password'>

const passwordSchema = userSchema.pick(['password', 'new_password', 'confirm_password'])

export default function ChangePassword() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError
  } = useForm<FormData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    },
    resolver: yupResolver(passwordSchema)
  })

  const updatePasswordMutation = useMutation({
    mutationFn: userApi.updatePassword
  })

  const onSubmit = handleSubmit(async (data: FormData) => {
    try {
      await updatePasswordMutation.mutateAsync(omit(data, 'confirm_password'))
      toast.success('Success')
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  return (
    <div className='rounded-sm bg-white px-5 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Đổi mật khẩu</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form className='mr-2 mt-8 max-w-2xl' onSubmit={onSubmit}>
        <div className='md:mt0 mt-6 flex-grow pr-12'>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='w-full truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Mật khẩu cũ</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm px-3 py-2'
                register={register}
                name='password'
                type='password'
                placeholder='Mật khẩu cũ'
                errorMessage={errors.password?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='w-full truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Mật khẩu mới</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm px-3 py-2'
                register={register}
                name='new_password'
                type='password'
                placeholder='Mật khẩu mới'
                errorMessage={errors.new_password?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='w-full truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Nhập lại mật khẩu</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm px-3 py-2'
                register={register}
                name='confirm_password'
                type='password'
                placeholder='Nhập lại mật khẩu'
                errorMessage={errors.confirm_password?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='w-full truncate pt-3 capitalize sm:w-[20%] sm:text-right'></div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Button className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'>
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
