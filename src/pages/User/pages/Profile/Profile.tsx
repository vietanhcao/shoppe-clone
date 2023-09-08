import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import userApi from '../../../../apis/user.api'
import Button from '../../../../components/Button/Button'
import Input from '../../../../components/Input/Input'
import InputNumber from '../../../../components/InputNumber/InputNumber'
import { UserSchema, userSchema } from '../../../../libs/rules'
import { getAvatarUrl, isAxiosUnprocessableEntityError } from '../../../../libs/utils'
import useGlobalStore from '../../../../store/useGlobalStore'
import { ErrorResponse } from '../../../../types/api.type'
import DateSelect from '../../components/DateSelect/DateSelect'
import config from '../../../../libs/config'

type FormData = Pick<UserSchema, 'name' | 'phone' | 'address' | 'date_of_birth' | 'avatar'>
type FormDataError = Omit<FormData, 'date_of_birth'> & { date_of_birth: string }

const profileSchema = userSchema.pick(['name', 'phone', 'address', 'date_of_birth', 'avatar'])

export default function Profile() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const previewImage = useMemo(() => {
    return file && URL.createObjectURL(file)
  }, [file])
  const {
    register,
    handleSubmit,
    setValue,
    control,
    setError,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })
  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile
  })
  const uploadAvatarMutation = useMutation({
    mutationFn: userApi.uploadAvatar
  })
  const { setProfile } = useGlobalStore()

  const avatar = watch('avatar')

  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: userApi.getProfile
  })
  const profile = profileData?.data.data

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('phone', profile.phone)
      setValue('address', profile.address)
      setValue('avatar', profile.avatar)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])

  const onSubmit = handleSubmit(async (data: FormData) => {
    try {
      let avatarName = avatar
      if (file) {
        const formData = new FormData()
        formData.append('image', file)
        const response = await uploadAvatarMutation.mutateAsync(formData)
        avatarName = response.data.data
        setValue('avatar', avatarName)
      }
      const response = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth ? data.date_of_birth.toISOString() : new Date(1990, 0, 1).toISOString(),
        avatar: avatarName
      })
      toast.success('Cập nhật thành công')
      setProfile(response.data.data)
      refetch()
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormDataError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > config.maxSizeUploadAvatar) {
      toast.error('Ảnh có kích thước tối đa là 1MB')
      return
    }
    if (!file.type.includes('image')) {
      toast.error('Ảnh không đúng định dạng')
      return
    }
    setFile(file)
  }

  const handleUpload = async () => {
    fileInputRef.current?.click()
  }
  return (
    <div className='rounded-sm bg-white px-5 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ sơ của tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
        <div className='md:mt0 mt-6 flex-grow pr-12'>
          <div className='flex flex-col flex-wrap sm:flex-row'>
            <div className='w-full truncate pt-3 capitalize sm:sm:w-[20%] sm:text-right'>Email</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <div className='pt-3 text-gray-700'>{profile?.email}</div>
            </div>
          </div>
          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='w-full truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Tên</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm px-3 py-2'
                register={register}
                name='name'
                placeholder='Nhập tên'
                errorMessage={errors.name?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='w-full truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Số điện thoại</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => {
                  return (
                    <InputNumber
                      classNameBoundary='grow'
                      placeholder='Số điện thoại'
                      classNameInput='w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm px-3 py-2'
                      errorMessage={errors.phone?.message}
                      {...field}
                      onChange={field.onChange}
                    />
                  )
                }}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='w-full truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Địa chỉ</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm px-3 py-2'
                register={register}
                name='address'
                placeholder='Địa chỉ'
                errorMessage={errors.address?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='w-full truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Ngày sinh</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Controller
                control={control}
                name='date_of_birth'
                render={({ field }) => {
                  return (
                    <DateSelect
                      errorMessage={errors.date_of_birth?.message}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e)
                      }}
                    />
                  )
                }}
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
        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='my-5 h-24 w-24'>
              <img src={previewImage || getAvatarUrl(avatar)} alt='avatar' className='h-full w-full object-cover' />
            </div>
            <input
              type='file'
              className='hidden'
              accept='.jpg,.jpeg,.png'
              ref={fileInputRef}
              onChange={onFileChange}
              onClick={(e) => {
                // fix bug: when user upload same image
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const target = e.target as any
                target.value = null
              }}
            />
            <button
              type='button'
              className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
              onClick={handleUpload}
            >
              Chọn ảnh
            </button>
            <div className='mt-3 text-gray-400'>
              <div>Dụng lượng file tối đa 1 MB</div>
              <div>Định dạng:.JPEG, .PNG</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
