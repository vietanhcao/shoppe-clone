import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { isEmpty, omit, omitBy } from 'lodash'
import { Controller, useForm } from 'react-hook-form'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import Button from '../../../components/Button/Button'
import InputNumber from '../../../components/InputNumber/InputNumber'
import pathUrl from '../../../constants/pathUrl'
import { Schema, schema } from '../../../libs/rules'
import { Category } from '../../../types/category.type'
import { QueryConfig } from '../ProductList'
import RatingStars from '../RatingStars/RatingStars'

interface AsideFilterProps {
  categories: Category[]
  queryConfig: QueryConfig
}

type FormData = Pick<Schema, 'price_max' | 'price_min'>

const priceSchema = schema.pick(['price_min', 'price_max'])

export default function AsideFilter({ categories, queryConfig }: AsideFilterProps) {
  const { category } = queryConfig
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(priceSchema),
    shouldFocusError: false
  })
  const navigate = useNavigate()

  const onSubmit = (data: FormData) => {
    navigate({
      pathname: pathUrl.home,
      search: createSearchParams(
        omitBy(
          {
            ...queryConfig,
            price_max: data.price_max ? data.price_max : '',
            price_min: data.price_min ? data.price_min : ''
          },
          isEmpty
        )
      ).toString()
    })
  }

  const handleRemveAllFilter = () => {
    navigate({
      pathname: pathUrl.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig
          },
          ['category', 'price_min', 'price_max', 'rating_filter']
        )
      ).toString()
    })
  }

  return (
    <div className='py-4'>
      <Link
        to={{
          pathname: pathUrl.home,
          search: createSearchParams(
            omit(
              {
                ...queryConfig
              },
              ['order', 'category']
            )
          ).toString()
        }}
        className={classNames('flex items-center font-bold', { 'text-orange': !category })}
      >
        <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        Tất cả danh mục
      </Link>
      <div className='my-4 h-[1px] bg-gray-300' />
      <ul>
        {categories.map((categoryItem) => (
          <li className='py-2 pl-2' key={categoryItem._id}>
            <Link
              to={{
                pathname: pathUrl.home,
                search: createSearchParams(
                  omit(
                    {
                      ...queryConfig,
                      category: categoryItem._id
                    },
                    ['order']
                  )
                ).toString()
              }}
              className={classNames('relative px-2 ', { 'font-semibold text-orange': categoryItem._id === category })}
            >
              {categoryItem._id === category && (
                <svg viewBox='0 0 4 7' className='absolute left-[-10px] top-1 h-2 w-2 fill-orange'>
                  <polygon points='4 3.5 0 0 0 7' />
                </svg>
              )}
              {categoryItem.name}
            </Link>
          </li>
        ))}
      </ul>

      <Link to={pathUrl.home} className='mt-4 flex items-center font-bold uppercase'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='mr-3 h-4 w-3 fill-current stroke-current '
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        Bộ lọc tìm kiếm
      </Link>
      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='my-5'>
        <div>Khoảng giá</div>
        <form className='mt-2' onSubmit={handleSubmit(onSubmit)}>
          <div className='flex items-start'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    classNameBoundary='grow'
                    placeholder='₫ TỪ'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    classNameError='hidden'
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      trigger('price_max')
                    }}
                  />
                )
              }}
            />

            <div className='mx-2 mt-2 flex-shrink-0'>-</div>

            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    classNameBoundary='grow'
                    placeholder='₫ ĐẾN'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    classNameError='hidden'
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      trigger('price_min')
                    }}
                  />
                )
              }}
            />
          </div>
          <div className={'mt-1 min-h-[1.25rem] text-center text-sm text-red-600'}>{errors.price_max?.message}</div>
          <Button className='flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange hover:opacity-80'>
            Áp dụng
          </Button>
        </form>
      </div>

      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='text-sm'>Đánh giá</div>
      <RatingStars queryConfig={queryConfig} />
      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='my-5 mt-2'>
        <Button
          onClick={handleRemveAllFilter}
          className='flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange hover:opacity-80'
        >
          Xoá tất cả
        </Button>
      </div>
    </div>
  )
}
