import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import RegisterLayout from './layouts/RegisterLayout'
import Login from './pages/Login'
import ProductList from './pages/ProductList'
import Register from './pages/Register'
import MainLayout from './layouts/MainLayout'
import Profile from './pages/Profile'
import useGlobalStore from './store/useGlobalStore'
import pathUrl from './constants/pathUrl'

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
          path: pathUrl.profile,
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          )
        }
      ]
    },
    {
      path: '',
      index: true,
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      )
    }
  ])
  return routeElements
}
