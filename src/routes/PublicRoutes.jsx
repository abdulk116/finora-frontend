import { Routes, Route, Navigate } from 'react-router'
import LoginAuth from '../pages/Auth/LoginAuth';
import LandingPage from '../pages/LandingPage/LandingPage';

const PublicRoutes = () => {
  
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginAuth />} />

      {/* ===================================== FALLBACK ===================================== */}
      <Route path="*" element={ <Navigate to="/" replace /> } />
    </Routes>
  )
}

export default PublicRoutes