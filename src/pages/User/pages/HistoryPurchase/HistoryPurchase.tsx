import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { Link, createSearchParams } from 'react-router-dom'
import purchaseApi from '../../../../apis/purchase.api'
import pathUrl from '../../../../constants/pathUrl'
import { purchasesStatus } from '../../../../constants/purchase'
import useQueryParams from '../../../../hooks/useQueryParams'
import { formatCurrency, generateNameId } from '../../../../libs/utils'
import { PurchaseListStatus } from '../../../../types/purchase.type'
import config from '../../../../libs/config'

const purchaseTabs = [
  {
    status: purchasesStatus.all,
    name: 'Tất cả'
  },
  {
    status: purchasesStatus.waitForConfirmation,
    name: 'Chờ xác nhận'
  },
  {
    status: purchasesStatus.waitForGetting,
    name: 'Chờ lấy hàng'
  },
  {
    status: purchasesStatus.inProgress,
    name: 'Đang giao hàng'
  },
  {
    status: purchasesStatus.delivered,
    name: 'Đã giao hàng'
  },
  {
    status: purchasesStatus.cancelled,
    name: 'Đã hủy'
  }
]

export default function HistoryPurchase() {
  const queryParams: { status?: string } = useQueryParams()
  const status: number = Number(queryParams.status) || purchasesStatus.all

  // khi chuyển trang Header chỉ bị render ko bị unmount - mount lại trừ trường hơp logout
  // nên query này ko bị inactive ko cần set staleTime
  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchase', { status }],
    queryFn: () => {
      let params: { [key: string]: unknown } = { 'status[eq]': status as PurchaseListStatus }
      if (status === 0) {
        params = {}
      }
      return purchaseApi.getPurchases(params)
    }
  })

  const purchasesInCart = purchasesInCartData?.data.data

  const purchaseTabsLink = purchaseTabs.map((tab) => (
    <Link
      key={tab.status}
      to={{
        pathname: pathUrl.historyPurchase,
        search: createSearchParams({
          status: String(tab.status)
        }).toString()
      }}
      className={classNames('flex flex-1 justify-center border-b-2 bg-white px-4 py-3 text-center', {
        'border-b-orange text-orange': status === tab.status,
        'border-b-black/10 text-gray-900 ': status !== tab.status
      })}
    >
      {tab.name}
    </Link>
  ))

  return (
    <div className='overflow-x-auto'>
      <div className='min-w-[700px]'>
        <div className='sticky top-0 flex rounded-t-sm shadow-sm'>{purchaseTabsLink}</div>
        <div className=''>
          {purchasesInCart?.map((purchase) => (
            <div key={purchase._id} className='mt-4 rounded-t-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm'>
              <Link
                to={`${pathUrl.home}${generateNameId({
                  name: purchase.product.name,
                  id: purchase.product._id
                })}`}
                className='flex'
              >
                <div className='flex-shrink-0'>
                  <img
                    className='h-20 w-20 object-cover'
                    src={config.baseUrlImage + purchase.product.images[0]}
                    alt={purchase.product.name}
                  />
                </div>
                <div className='ml-3 flex-grow overflow-hidden'>
                  <div className='truncate'>{purchase.product.name}</div>
                  <div className='text-sm text-gray-500'>Số lượng: {purchase.buy_count}</div>
                </div>
                <div className='ml-3 flex-shrink-0'>
                  <div className='truncate text-gray-500 line-through'>
                    <span className='text-xs'>₫</span>
                    <span className='text-sm'>{formatCurrency(purchase.product.price_before_discount)}</span>
                  </div>
                </div>
                <div className='ml-2 truncate text-orange'>
                  <span className='text-xs'>₫</span>
                  <span className='text-sm'>{formatCurrency(purchase.product.price)}</span>
                </div>
              </Link>
              <div className='flex justify-end'>
                <div>
                  <span>Thành tiền</span>
                  <span className='ml-4 text-xl text-orange'>
                    ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
