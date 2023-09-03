import { Product, ProductList, ProductListConfig } from 'src/types/product.type'
import http from '../libs/http'
import { SuccessResponse } from '../types/api.type'

const URL = 'products'
const productApi = {
  getProducts(params: ProductListConfig) {
    return http.get<SuccessResponse<ProductList>>(URL, {
      params
    })
  },
  getProductDetail(id: string) {
    return http.get<SuccessResponse<Product>>(`${URL}/${id}`)
  }
}

export default productApi
