import React, { Suspense } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import pathUrl from './constants/pathUrl'
import CartLayout from './layouts/CartLayout/CartLayout'
import MainLayout from './layouts/MainLayout'
import RegisterLayout from './layouts/RegisterLayout'
import NotFound from './pages/NotFound/NotFound'
import UserLayout from './pages/User/layouts/UserLayout/UserLayout'
import useGlobalStore from './store/useGlobalStore'

const Login = React.lazy(() => import('./pages/Login'))
const Register = React.lazy(() => import('./pages/Register'))
const Cart = React.lazy(() => import('./pages/Cart/Cart'))
const ProductList = React.lazy(() => import('./pages/ProductList'))
const ProductDetail = React.lazy(() => import('./pages/ProductDetail/ProductDetail'))
const ChangePassword = React.lazy(() => import('./pages/User/pages/ChangePassword/ChangePassword'))
const HistoryPurchase = React.lazy(() => import('./pages/User/pages/HistoryPurchase/HistoryPurchase'))
const Profile = React.lazy(() => import('./pages/User/pages/Profile/Profile'))

function ProtectedRoute() {
  const isAuthenticated = useGlobalStore.getState().accessToken
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
  const isAuthenticated = useGlobalStore.getState().accessToken
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default function useRouteElement() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: pathUrl.login,
          element: (
            <RegisterLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <Login />
              </Suspense>
            </RegisterLayout>
          )
        },
        {
          path: pathUrl.register,
          element: (
            <RegisterLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <Register />
              </Suspense>
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: pathUrl.cart,
          element: (
            <CartLayout>
              <Suspense fallback={<div>Loading...</div>}>
                <Cart />
              </Suspense>
            </CartLayout>
          )
        },

        {
          path: pathUrl.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: pathUrl.profile,
              element: (
                <Suspense fallback={<div>Loading...</div>}>
                  <Profile />
                </Suspense>
              )
            },
            {
              path: pathUrl.changePassword,
              element: (
                <Suspense fallback={<div>Loading...</div>}>
                  <ChangePassword />
                </Suspense>
              )
            },
            {
              path: pathUrl.historyPurchase,
              element: (
                <Suspense fallback={<div>Loading...</div>}>
                  <HistoryPurchase />
                </Suspense>
              )
            }
          ]
        }
      ]
    },
    {
      path: pathUrl.productDetail,
      element: (
        <MainLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <ProductDetail />
          </Suspense>
        </MainLayout>
      )
    },
    {
      path: '',
      index: true,
      element: (
        <MainLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <ProductList />
          </Suspense>
        </MainLayout>
      )
    },
    {
      path: '*',
      element: (
        <MainLayout>
          <NotFound />
        </MainLayout>
      )
    }
  ])
  return routeElements
}
