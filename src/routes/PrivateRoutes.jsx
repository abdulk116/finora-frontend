import { Navigate, Route, Routes } from "react-router"
import Dashboard from "../pages/Dashboard/Dashboard";
import AppLayout from "../layouts/AppLayout";
import AddLoan from "../pages/LoanManagement/components/AddLoan/AddLoan";
import EmiManagement from "../pages/EmiManagement/EmiManagement";
import LoanManagement from "../pages/LoanManagement/LoanManagement";
import LoanDetails from "../pages/LoanManagement/components/LoanDetails/LoanDetails";
import MonthlyExpenses from "../pages/MonthlyExpenses/MonthlyExpenses";

const PrivateRoutes = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/dashboard" element={< Dashboard/>} />
        <Route path="/loans" element={< LoanManagement/>} />
        <Route path="/loan/:id" element={< LoanDetails/>} />
        <Route path="/loan/add" element={< AddLoan/>} />
        <Route path="/emi-list" element={< EmiManagement/>} />
        <Route path="/expenses" element={< MonthlyExpenses/>} />

        {/* ===================================== FALLBACK ===================================== */}
      <Route path="*" element={ <Navigate to="/" replace /> } />
      </Routes>
    </AppLayout>
  )
}

export default PrivateRoutes