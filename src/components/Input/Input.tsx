/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameBoundary?: string
  register?: UseFormRegister<any>
  rules?: RegisterOptions
  classNameInput?: string
  classNameError?: string
}

export default function Input({
  errorMessage,
  classNameBoundary,
  name,
  register,
  rules,
  autoComplete,
  classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
  classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
  ...rest
}: InputProps) {
  const registerOptions = name && register ? register(name, rules) : null
  return (
    <div className={classNameBoundary}>
      <input className={classNameInput} {...registerOptions} autoComplete={autoComplete} {...rest} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}
