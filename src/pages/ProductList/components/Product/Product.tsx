import { Link } from 'react-router-dom'
import { Product as ProductType } from '../../../../types/product.type'
import { formatCurrency, formatNumberToSocialStyle, generateNameId } from '../../../../libs/utils'
import ProductRating from '../../../../components/ProductRating/ProductRating'
import pathUrl from '../../../../constants/pathUrl'

interface ProductProps {
  product: ProductType
}

export default function Product({ product }: ProductProps) {
  return (
    <Link
      to={`${pathUrl.home}${generateNameId({
        name: product.name,
        id: product._id
      })}`}
    >
      <div className='overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.3rem] hover:shadow-md '>
        <div className='relative w-full pt-[100%]'>
          <img
            src={product.images[0]}
            alt={product.name}
            className='absolute left-0 top-0 h-full w-full bg-white object-cover'
          />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='line-clamp-2 min-h-[2rem] text-xs'>{product.name}</div>
          <div className='mt-3 flex items-center'>
            <div className='max-w-[50%] truncate text-gray-500 line-through'>
              <span className='text-xs'>₫</span>
              <span className='text-sm'>{formatCurrency(product.price_before_discount)}</span>
            </div>
            <div className='ml-1 truncate text-orange'>
              <span className='text-xs'>₫</span>
              <span className='text-sm'>{formatCurrency(product.price)}</span>
            </div>
          </div>
          <div className='mt-3 flex items-center justify-start'>
            <ProductRating rating={product.rating} />
            <div className='ml-2 text-sm'>
              <span>Đã bán</span>
              <span className='ml-1'>{formatNumberToSocialStyle(product.sold)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
