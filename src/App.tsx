import BudgetPreviewSection from "./components/layout/BudgetPreview";
import Calendar from "./components/layout/Calendar";
import SelectedDayTransaction from "./components/layout/SelectedDayTransaction";
import CategoryBreakdown from "./components/layout/CetegoryBreakdown";
import Navbar from "./components/layout/Navbar";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Calendar/>}/>
        <Route path="/budget-overview" element={<BudgetPreviewSection/>}/>
      </Routes>
      
      {/* <main className="main-content">
        <BudgetPreviewSection />
        <Calendar />
        <SelectedDayTransaction />
        <CategoryBreakdown />
      </main> */}
    </div>
  )
}

export default App;
