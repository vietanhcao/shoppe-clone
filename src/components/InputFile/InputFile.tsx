import { useRef } from 'react'
import toast from 'react-hot-toast'
import config from '../../libs/config'

interface InputFileProps {
  onChange?: (file: File) => void
}

export default function InputFile({ onChange }: InputFileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    fileInputRef.current?.setAttribute('value', '')
    if (file.size > config.maxSizeUploadAvatar) {
      toast.error('Ảnh có kích thước tối đa là 1MB')
      return
    }
    if (!file.type.includes('image')) {
      toast.error('Ảnh không đúng định dạng')
      return
    }
    onChange && onChange(file)
  }

  const handleUpload = async () => {
    fileInputRef.current?.click()
  }
  return (
    <>
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
    </>
  )
}
