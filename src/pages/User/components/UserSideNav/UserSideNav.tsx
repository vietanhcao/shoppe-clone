import { Link, NavLink } from 'react-router-dom'
import pathUrl from '../../../../constants/pathUrl'
import { getAvatarUrl } from '../../../../libs/utils'
import useGlobalStore from '../../../../store/useGlobalStore'
import classNames from 'classnames'

export default function UserSideNav() {
  const store = useGlobalStore()
  return (
    <div>
      <div className='flex items-center border-b border-b-gray-200 py-4'>
        <Link
          to={pathUrl.profile}
          className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-black/10'
        >
          <img src={getAvatarUrl(store.profile?.avatar)} alt='avatar' className='h-full w-full object-cover' />
        </Link>
        <div className='flex-grow pl-4'>
          <div className='mb-1 truncate font-semibold text-gray-600'>{store.profile?.email}</div>
          <Link to={pathUrl.profile} className='flex items-center text-gray-500 marker:capitalize'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-3 w-3'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125'
              />
            </svg>
            <span className='ml-1'>Sửa hồ sơ</span>
          </Link>
        </div>
      </div>
      <div className='mt-7'>
        <NavLink
          to={pathUrl.profile}
          className={({ isActive }) =>
            classNames('flex items-center capitalize  transition-colors', {
              'text-orange': isActive,
              'text-gray-600': !isActive
            })
          }
        >
          <div className='mr-3 h-[22px] w-[22px]'>
            <img src='https://cf.shopee.vn/file/ba61750a46794d8847c3f463c5e71cc4' alt='' className='h-full w-full' />
          </div>
          Tài khoản của tôi
        </NavLink>
        <NavLink
          to={pathUrl.changePassword}
          className={({ isActive }) =>
            classNames('mt-4 flex items-center capitalize transition-colors', {
              'text-orange': isActive,
              'text-gray-600': !isActive
            })
          }
        >
          <div className='mr-3 h-[22px] w-[22px]'>
            <img src='https://cf.shopee.vn/file/ba61750a46794d8847c3f463c5e71cc4' alt='' className='h-full w-full' />
          </div>
          Đổi mật khẩu
        </NavLink>
        <NavLink
          to={pathUrl.historyPurchase}
          className={({ isActive }) =>
            classNames('mt-4 flex items-center  capitalize transition-colors', {
              'text-orange': isActive,
              'text-gray-600': !isActive
            })
          }
        >
          <div className='mr-3 h-[22px] w-[22px]'>
            <img src='https://cf.shopee.vn/file/f0049e9df4e536bc3e7f140d071e9078' alt='' className='h-full w-full' />
          </div>
          Đơn mua
        </NavLink>
      </div>
    </div>
  )
}
