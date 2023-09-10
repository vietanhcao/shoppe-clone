import range from 'lodash/range'
import { useEffect, useState } from 'react'

interface DateSelectProps {
  errorMessage?: string
  onChange?(value: Date): void
  value?: Date
}

export default function DateSelect({ errorMessage, onChange, value }: DateSelectProps) {
  const [date, setDate] = useState({
    date: 1,
    month: 0,
    year: 1990
  })

  useEffect(() => {
    if (value) {
      setDate({
        date: value?.getDate() || 1,
        month: value?.getMonth() || 0,
        year: value?.getFullYear() || 1990
      })
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value: valueFromSelect } = e.target
    const _data = {
      date: value?.getDate() || 1,
      month: value?.getMonth() || 0,
      year: value?.getFullYear() || 1990,
      [name]: Number(valueFromSelect)
    }
    setDate(_data)
    onChange && onChange(new Date(_data.year, _data.month, _data.date))
  }

  return (
    <>
      <div className='flex justify-between'>
        <select
          className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange'
          name='date'
          value={value?.getDate() || date.date}
          onChange={handleChange}
        >
          <option disabled>Ngày</option>
          {range(1, 32).map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange'
          name='month'
          value={value?.getMonth() || date.month}
          onChange={handleChange}
        >
          <option disabled>Tháng</option>
          {range(0, 12).map((item) => (
            <option key={item} value={item}>
              {item + 1}
            </option>
          ))}
        </select>
        <select
          className='h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3 hover:border-orange'
          name='year'
          value={value?.getFullYear() || date.year}
          onChange={handleChange}
        >
          <option disabled>Năm</option>
          {range(1990, 2024).map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errorMessage}</div>
    </>
  )
}
