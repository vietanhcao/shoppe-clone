import Footer from '../../components/Footer'
import Header from '../../components/Header'

interface MainLayoutProps {
  children?: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default MainLayout
