import './App.css'
import PublicRoutes from "./routes/PublicRoutes";
import PrivateRoutes from './routes/PrivateRoutes';
import { useSelector } from 'react-redux';

function App() {
  const isLogin = useSelector((state) => state?.auth?.isAuthenticated)

  return (
    <div className='app-container' >
      {!isLogin ? <PublicRoutes /> : <PrivateRoutes />}
    </div>
  )
}

export default App
