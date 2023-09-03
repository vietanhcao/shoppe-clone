import AsideFilter from './AsideFilter/AsideFilter'
import Product from './Product/Product'
import SortProductList from './SortProductList/SortProductList'

export default function ProductList() {
  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-3'>
            <AsideFilter />
          </div>
          <div className='col-span-9'>
            <SortProductList />
            <div className='mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2'>
              {/* <!-- Product Card --> */}
              {Array.from({ length: 30 }).map((_, index) => (
                <div key={index} className='col-span-1'>
                  <Product />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
