import http from '../libs/http'
import { SuccessResponse } from '../types/api.type'
import { Category } from '../types/category.type'

const URL = 'categories'

const categoryApi = {
  getCategories() {
    return http.get<SuccessResponse<Category[]>>(URL)
  }
}

export default categoryApi
