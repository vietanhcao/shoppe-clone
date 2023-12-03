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
import { omit } from 'lodash'

export default function ProductList() {
  const queryConfig = useQueryConfig()
  console.log('queryConfig', queryConfig)
  // convert page to offset
  if (queryConfig.page) {
    queryConfig.offset = `${(Number(queryConfig.page) - 1) * Number(queryConfig.limit)}`
    // delete queryConfig.page
  }

  if (queryConfig.sort_by) {
    queryConfig[`${queryConfig.sort_by}[sort]`] = queryConfig.order === 'desc' ? 'desc' : 'asc'
  }

  if (queryConfig.category) {
    queryConfig[`category[eq]`] = queryConfig.category
  }

  if (queryConfig.price_min) {
    queryConfig[`price[gte]`] = queryConfig.price_min
  }

  if (queryConfig.price_max) {
    queryConfig[`price[lte]`] = queryConfig.price_max
  }

  if (queryConfig.rating_filter) {
    queryConfig[`rating[gte]`] = queryConfig.rating_filter
  }

  if (queryConfig.name) {
    queryConfig[`name[contains]`] = queryConfig.name
  }

  const { data: productData } = useQuery({
    queryKey: ['productList', queryConfig],
    queryFn: () =>
      productApi.getProducts(
        omit(queryConfig as ProductListConfig, ['page', 'category', 'price_min', 'price_max', 'rating_filter', 'name'])
      ),
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
              <SortProductList queryConfig={queryConfig} pageSize={productData.data.data.pagination.totalPages} />
              <div className='mt-6 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {/* <!-- Product Card --> */}
                {productData.data.data.products.map((product) => (
                  <div key={product._id} className='col-span-1'>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <Pagination queryConfig={queryConfig} pageSize={productData.data.data.pagination.totalPages} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
