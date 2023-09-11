import { InputHTMLAttributes, useState } from 'react'
import { FieldPath, FieldValues, UseControllerProps, useController } from 'react-hook-form'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  classNameBoundary?: string
}

function InputV2<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: UseControllerProps<TFieldValues, TName> & InputNumberProps) {
  const {
    type,
    onChange,
    classNameBoundary,
    classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
    classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
    value = '',
    ...rest
  } = props
  const { field, fieldState } = useController(props)
  const [localValue, setLocalValue] = useState<string>(field.value)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value: valueFromInput } = event.target
    const numberCondition = type === 'number' && (/^\d+$/.test(valueFromInput) || valueFromInput === '')
    if (numberCondition || type !== 'number') {
      // Cập nhật localValue state
      setLocalValue(valueFromInput)
      // call field.onChange to update value in formState
      field.onChange(event)
      // Thực thi onChange callback từ bên ngoài truyền vào props
      onChange && onChange(event)
    }
  }
  console.log('value typeof', typeof value)
  console.log('value', value)
  console.log('localValue typeof', typeof localValue)
  console.log('localValue', localValue)
  return (
    <div className={classNameBoundary}>
      <input
        className={classNameInput}
        {...field}
        {...rest}
        onChange={handleChange}
        value={value === undefined ? localValue : ''}
      />
      <div className={classNameError}>{fieldState.error?.message}</div>
    </div>
  )
}

export default InputV2
