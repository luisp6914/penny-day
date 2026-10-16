import Navbar from "./components/layout/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import CalendarPage from "./pages/CalendarPage";
import BudgetPage from "./pages/BudgetPage";
import LoansPage from "./pages/LoansPage";

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6">
        <Routes>
          <Route path="/" element={<CalendarPage/>}/>
          <Route path="/budget-overview" element={<BudgetPage/>}/>
          <Route path="/loans" element={<LoansPage/>}/>
          <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
      </main>
    </div>
  )
}

export default App;
