import Header from "./components/layout/Header";
import BudgetPreviewSection from "./components/layout/BudgetPreview";
import Calendar from "./components/layout/Calendar";
import SelectedDayTransaction from "./components/layout/SelectedDayTransaction";
import CategoryBreakdown from "./components/layout/CetegoryBreakdown";

import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <BudgetPreviewSection />
        <Calendar />
        <SelectedDayTransaction />
        <CategoryBreakdown />
      </main>
    </div>
  )
}

export default App;
