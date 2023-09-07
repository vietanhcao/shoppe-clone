import { useMutation, useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import { keyBy } from 'lodash'
import React, { useEffect, useMemo } from 'react'
import { toast } from 'react-hot-toast'
import { Link, useLocation } from 'react-router-dom'
import purchaseApi from '../../apis/purchase.api'
import noproduct from '../../assets/images/no-product.png'
import Button from '../../components/Button/Button'
import QuantityController from '../../components/QuantityController/QuantityController'
import pathUrl from '../../constants/pathUrl'
import { purchasesStatus } from '../../constants/purchase'
import { formatCurrency, generateNameId } from '../../libs/utils'
import useProductStore from '../../store/useProductStore'
import { Purchase } from '../../types/purchase.type'

export default function Cart() {
  const { extendedPurchases, setExtendedPurchases } = useProductStore()
  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchase', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart })
  })
  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })
  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: () => {
      toast.success('Đặt hàng thành công', { position: 'top-right' })
      refetch()
    }
  })
  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch()
    }
  })
  const location = useLocation()
  const choosenPurchaseIdFromLocation = (location.state as { purchaseId: string | null })?.purchaseId
  const purchasesInCart = purchasesInCartData?.data.data
  const isAllChecked = useMemo(() => {
    return !!extendedPurchases.length && extendedPurchases.every((purchase) => purchase.checked)
  }, [extendedPurchases])
  const checkedPurchases = useMemo(() => {
    return extendedPurchases.filter((purchase) => purchase.checked)
  }, [extendedPurchases])
  const checkedPurchasesCount = useMemo(() => {
    return checkedPurchases.length
  }, [checkedPurchases])
  const totalPrice = useMemo(() => {
    return checkedPurchases.reduce((total, purchase) => {
      return total + purchase.buy_count * purchase.product.price
    }, 0)
  }, [checkedPurchases])
  const totalPriceSave = useMemo(() => {
    return checkedPurchases.reduce((total, purchase) => {
      return total + (purchase.product.price_before_discount - purchase.product.price) * purchase.buy_count
    }, 0)
  }, [checkedPurchases])
  useEffect(() => {
    if (purchasesInCart) {
      const extendedPurchasesObject = keyBy(extendedPurchases, '_id')
      setExtendedPurchases(
        purchasesInCart.map((purchase) => {
          const isChoosenPurchaseFromLocation = purchase._id === choosenPurchaseIdFromLocation
          return {
            ...purchase,
            disabled: false,
            checked: isChoosenPurchaseFromLocation || Boolean(extendedPurchasesObject[purchase._id]?.checked)
          }
        })
      )
    }
  }, [purchasesInCart, choosenPurchaseIdFromLocation])

  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

  const handleChecked = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target
    setExtendedPurchases(
      produce(extendedPurchases, (draft) => {
        draft[purchaseIndex].checked = checked
      })
    )
  }

  const handleCheckedAll = () => {
    setExtendedPurchases(extendedPurchases.map((purchase) => ({ ...purchase, checked: !isAllChecked })))
  }

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (!enable) return
    const purchase = extendedPurchases[purchaseIndex]
    setExtendedPurchases(
      produce(extendedPurchases, (draft) => {
        draft[purchaseIndex].disabled = true
      })
    )
    updatePurchaseMutation.mutate({
      product_id: purchase.product._id,
      buy_count: value
    })
  }

  const handleHandleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce(extendedPurchases, (draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id
    deletePurchasesMutation.mutate([purchaseId])
  }

  const handleDeleteManyPurchases = () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase._id)
    deletePurchasesMutation.mutate(purchaseIds)
  }

  const handleBuyProducts = () => {
    if (checkedPurchasesCount === 0) return
    const body = checkedPurchases.map((purchase) => ({
      product_id: purchase.product._id,
      buy_count: purchase.buy_count
    }))
    buyProductsMutation.mutate(body)
  }

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        {extendedPurchases.length > 0 ? (
          <>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm capitalize text-gray-500 shadow'>
                  <div className='col-span-6 '>
                    <div className='flex items-center'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h-5 w-5 accent-orange'
                          checked={isAllChecked}
                          onChange={handleCheckedAll}
                        />
                      </div>
                      <div className='flex-grow text-black'>Sản phẩm</div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 text-center'>
                      <div className='col-span-2'>Đơn giá</div>
                      <div className='col-span-1'>Số lượng</div>
                      <div className='col-span-1'>Số tiền</div>
                      <div className='col-span-1'>Thao tác</div>
                    </div>
                  </div>
                </div>

                {extendedPurchases.length && (
                  <div className='my-3 rounded-sm bg-white p-5 shadow'>
                    {extendedPurchases?.map((purchase, index) => (
                      <div
                        key={purchase._id}
                        className=' mt-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white px-5 py-4 text-center text-sm text-gray-500 first:mt-5'
                      >
                        <div className='col-span-6'>
                          <div className='flex items-center'>
                            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                              <input
                                type='checkbox'
                                className='h-5 w-5 accent-orange'
                                checked={purchase.checked}
                                onChange={handleChecked(index)}
                              />
                            </div>
                            <div className='flex-grow'>
                              <div className='flex items-center'>
                                <Link
                                  to={`${pathUrl.home}${generateNameId({
                                    name: purchase.product.name,
                                    id: purchase.product._id
                                  })}`}
                                  className='h-20 w-20 flex-shrink-0'
                                >
                                  <img alt={purchase.product.name} src={purchase.product.images[0]} />
                                </Link>
                                <div className='flex-grow px-2 pb-2 pt-1'>
                                  <Link
                                    to={`${pathUrl.home}${generateNameId({
                                      name: purchase.product.name,
                                      id: purchase.product._id
                                    })}`}
                                    className='line-clamp-2 text-left'
                                  >
                                    {purchase.product.name}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='col-span-6'>
                          <div className='grid grid-cols-5 items-center'>
                            <div className='col-span-2'>
                              <div className='flex items-center justify-center'>
                                <span className='text-gray-300 line-through'>
                                  ₫{formatCurrency(purchase.product.price_before_discount)}
                                </span>
                                <span className='ml-3'>₫{formatCurrency(purchase.product.price)}</span>
                              </div>
                            </div>
                            <div className='col-span-1'>
                              <QuantityController
                                classNameWarpper=''
                                max={purchase.product.quantity}
                                value={purchase.buy_count}
                                onIncrease={(value) => handleQuantity(index, value, purchase.product.quantity > value)}
                                onDecrease={(value) => handleQuantity(index, value, purchase.buy_count > 1)}
                                onType={handleHandleTypeQuantity(index)}
                                onFocusOut={(value) => {
                                  if (value === (purchasesInCart as Purchase[])[index].buy_count) return
                                  handleQuantity(
                                    index,
                                    value,
                                    purchase.product.quantity > value && purchase.buy_count > 1
                                  )
                                }}
                                disabled={purchase.disabled}
                              />
                            </div>
                            <div className='col-span-1'>
                              <span className='text-orange'>
                                ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                              </span>
                            </div>
                            <div className='col-span-1'>
                              <button
                                onClick={handleDelete(index)}
                                className='bg-none text-black transition-colors hover:text-orange'
                              >
                                Xoá{' '}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className='sticky bottom-0 z-10 mt-10 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center'>
              <div className='flex items-center'>
                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                  <input
                    type='checkbox'
                    className='h-5 w-5 accent-orange'
                    checked={isAllChecked}
                    onChange={handleCheckedAll}
                  />
                </div>
                <button className='mx-3 border-none bg-none'>
                  <span className='text-gray-500'>Chọn tất cả ({extendedPurchases.length})</span>
                </button>
                <button className='mx-3 border-none bg-none' onClick={handleDeleteManyPurchases}>
                  <span className='text-gray-500'>Xoá</span>
                </button>
              </div>
              <div className='mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
                <div>
                  <div className='flex items-center sm:justify-end'>
                    <div>Tổng thanh toán ({checkedPurchasesCount} sản phẩm):</div>
                    <div className='ml-2 text-2xl text-orange'>₫{formatCurrency(totalPrice)}</div>
                  </div>
                  <div className='flex items-center text-sm sm:justify-end'>
                    <div className='text-gray-500'>Tiếp kiệm</div>
                    <div className='ml-6 text-orange'>₫{formatCurrency(totalPriceSave)}</div>
                  </div>
                </div>
                <Button
                  onClick={handleBuyProducts}
                  disabled={buyProductsMutation.isLoading}
                  className=' mt-5 h-10 w-52 bg-red-500 text-center text-xs uppercase text-white hover:bg-red-600 sm:ml-4 sm:mt-0'
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className='text-center'>
            <div className='flex items-center justify-center'>
              <img src={noproduct} alt='no purchase' className='h-24 w-24' />
            </div>
            <div className='mt-5 font-bold text-gray-600'>Giỏ hàng của bạn còn trống</div>
            <Link
              to={pathUrl.home}
              className='mt-5  inline-block rounded-sm bg-orange px-6 py-2 uppercase text-white transition-all hover:bg-orange/80'
            >
              Mua ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
