import { create } from 'zustand'

import { logger } from './logger'
import { ExtendedPurchase } from '../types/purchase.type'

interface ProductState {
  extendedPurchases: ExtendedPurchase[]
  setExtendedPurchases: (extendedPurchases: ExtendedPurchase[]) => void
}

const useProductStore = create<ProductState>()(
  logger<ProductState>(
    (set) => ({
      extendedPurchases: [],
      setExtendedPurchases: (extendedPurchases: ExtendedPurchase[]) => set({ extendedPurchases: extendedPurchases })
    }),
    'productStore'
  )
)

export default useProductStore
