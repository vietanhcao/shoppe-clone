import Footer from '../../components/Footer'
import RegisterHeader from '../../components/RegisterHeader'

interface RegisterLayoutProps {
  children?: React.ReactNode
}

const RegisterLayout = ({ children }: RegisterLayoutProps) => {
  return (
    <div>
      <RegisterHeader />
      {children}
      <Footer />
    </div>
  )
}

export default RegisterLayout
