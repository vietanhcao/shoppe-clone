import { useQuery } from '@tanstack/react-query'
import { isUndefined, omitBy } from 'lodash'

import productApi from '../../apis/product.api'
import Pagination from '../../components/Pagination/Pagination'
import useQueryParams from '../../hooks/useQueryParams'
import { ProductListConfig } from '../../types/product.type'
import AsideFilter from './AsideFilter/AsideFilter'
import Product from './Product/Product'
import SortProductList from './SortProductList/SortProductList'
import categoryApi from '../../apis/category.api'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function ProductList() {
  const queryParams = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || '7',
      sort_by: queryParams.sort_by,
      exclude: queryParams.exclude,
      name: queryParams.name,
      order: queryParams.order,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      rating_filter: queryParams.rating_filter,
      category: queryParams.category
    },
    isUndefined
  )

  const { data: productData } = useQuery({
    queryKey: ['productList', queryConfig],
    queryFn: () => productApi.getProducts(queryConfig as ProductListConfig),
    keepPreviousData: true
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories()
  })

  return (
    <div className='bg-gray-200 py-6'>
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
