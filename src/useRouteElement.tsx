import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import RegisterLayout from './layouts/RegisterLayout'
import Login from './pages/Login'
import ProductList from './pages/ProductList'
import Register from './pages/Register'
import MainLayout from './layouts/MainLayout'
import useGlobalStore from './store/useGlobalStore'
import pathUrl from './constants/pathUrl'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import Cart from './pages/Cart/Cart'
import CartLayout from './layouts/CartLayout/CartLayout'
import UserLayout from './pages/User/layouts/UserLayout/UserLayout'
import ChangePassword from './pages/User/pages/ChangePassword/ChangePassword'
import Profile from './pages/User/pages/Profile/Profile'
import HistoryPurchase from './pages/User/pages/HistoryPurchase/HistoryPurchase'
import NotFound from './pages/NotFound/NotFound'

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
              <Login />
            </RegisterLayout>
          )
        },
        {
          path: pathUrl.register,
          element: (
            <RegisterLayout>
              <Register />
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
              <Cart />
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
              element: <Profile />
            },
            {
              path: pathUrl.changePassword,
              element: <ChangePassword />
            },
            {
              path: pathUrl.historyPurchase,
              element: <HistoryPurchase />
            }
          ]
        }
      ]
    },
    {
      path: pathUrl.productDetail,
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    },
    {
      path: '',
      index: true,
      element: (
        <MainLayout>
          <ProductList />
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
