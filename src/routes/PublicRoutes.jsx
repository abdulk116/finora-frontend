import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router'
import LoginAuth from '../pages/Auth/LoginAuth';

const PublicRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location?.pathname !== "/login") {
      navigate("/login");
    }
  }, [])
  
  return (
    <Routes>
      <Route path="/login" element={<LoginAuth />} />
    </Routes>
  )
}

export default PublicRoutes