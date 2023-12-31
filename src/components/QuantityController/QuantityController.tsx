import React, { InputHTMLAttributes, useState } from 'react'
import InputNumber from '../InputNumber/InputNumber'

interface QuantityControllerProps extends InputHTMLAttributes<HTMLInputElement> {
  max?: number
  onIncrease?: (value: number) => void
  onDecrease?: (value: number) => void
  onFocusOut?: (value: number) => void
  onType?: (value: number) => void
  classNameWarpper?: string
}

export default function QuantityController({
  max,
  onIncrease,
  onDecrease,
  onType,
  onFocusOut,
  classNameWarpper = 'ml-10',
  value,
  ...rest
}: QuantityControllerProps) {
  const [localValue, setLocalValue] = useState<number>(Number(value) || 0)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(event.target.value)
    if (max !== undefined && _value > max) {
      _value = max
    } else if (_value < 1) {
      _value = 1
    }
    onType && onType(_value)
    setLocalValue(_value)
  }

  const handleIncrease = () => {
    let _value = Number(value || localValue) + 1
    if (max !== undefined && _value > max) {
      _value = max
    }
    onIncrease && onIncrease(_value)
    setLocalValue(_value)
  }

  const handleDecrease = () => {
    let _value = Number(value || localValue) - 1
    if (_value < 1) {
      _value = 1
    }
    onDecrease && onDecrease(_value)
    setLocalValue(_value)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    // let _value = Number(e.target.value || localValue) + 1
    // if (max !== undefined && _value > max) {
    //   _value = max
    // } else if (_value < 1) {
    //   _value = 1
    // }

    onFocusOut && onFocusOut(Number(e.target.value))
    // setLocalValue(_value)
  }

  return (
    <div className={classNameWarpper + ' flex items-center'}>
      <button
        className='flex h-8 w-8 items-center justify-center rounded-l-sm  border border-gray-300 text-gray-600'
        onClick={handleDecrease}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15' />
        </svg>
      </button>
      <InputNumber
        classNameBoundary=''
        classNameError='hidden'
        classNameInput='h-8 w-14 border-t border-b border-gray-300 text-center outline-none'
        onChange={handleChange}
        onBlur={handleBlur}
        value={value || localValue}
        {...rest}
      />
      <button
        className='flex h-8 w-8 items-center justify-center rounded-r-sm  border border-gray-300 text-gray-600'
        onClick={handleIncrease}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
        </svg>
      </button>
    </div>
  )
}
