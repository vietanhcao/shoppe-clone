import { Link } from 'react-router-dom'
import { Product as ProductType } from '../../../types/product.type'
import { formatCurrency, formatNumberToSocialStyle } from '../../../libs/utils'
import ProductRating from '../../../components/ProductRating/ProductRating'

interface ProductProps {
  product: ProductType
}

export default function Product({ product }: ProductProps) {
  return (
    <Link to='/'>
      <div className='bg-white shadow rounded-sm hover:translate-y-[-0.3rem] hover:shadow-md duration-100 transition-transform overflow-hidden '>
        <div className='w-full pt-[100%] relative'>
          <img
            src={product.images[0]}
            alt={product.name}
            className='absolute top-0 left-0 w-full h-full object-cover bg-white'
          />
        </div>
        <div className='p-2 overflow-hidden'>
          <div className='min-h-[2rem] line-clamp-2 text-xs'>[100ml] Nước Hoa Nam Lalique Ombre Noire EDP</div>
          <div className='flex items-center mt-3'>
            <div className='line-through max-w-[50%] text-gray-500 truncate'>
              <span className='text-xs'>₫</span>
              {formatCurrency(product.price_before_discount)}
            </div>
            <div className='text-orange truncate ml-1'>
              <span className='text-xs'>₫</span>
              {formatCurrency(product.price)}
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
