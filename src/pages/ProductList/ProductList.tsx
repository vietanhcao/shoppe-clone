import { useQuery } from '@tanstack/react-query'

import categoryApi from '../../apis/category.api'
import productApi from '../../apis/product.api'
import Pagination from '../../components/Pagination/Pagination'
import useQueryConfig from '../../hooks/useQueryConfig'
import { ProductListConfig } from '../../types/product.type'
import AsideFilter from './components/AsideFilter/AsideFilter'
import Product from './components/Product/Product'
import SortProductList from './components/SortProductList/SortProductList'
import { Helmet } from 'react-helmet-async'

export default function ProductList() {
  const queryConfig = useQueryConfig()

  const { data: productData } = useQuery({
    queryKey: ['productList', queryConfig],
    queryFn: () => productApi.getProducts(queryConfig as ProductListConfig),
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories()
  })

  return (
    <div className='bg-gray-200 py-6'>
      <Helmet>
        <title>Trang chủ | Shopee Clone</title>
        <meta name='description' content='Trang chủ dự án Shopee Clone' />
      </Helmet>
      <div className='container'>
        {productData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter categories={categoriesData?.data.data || []} queryConfig={queryConfig} />
            </div>
            <div className='col-span-9'>
              <SortProductList queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
              <div className='mt-6 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {/* <!-- Product Card --> */}
                {productData.data.data.products.map((product) => (
                  <div key={product._id} className='col-span-1'>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <Pagination queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
