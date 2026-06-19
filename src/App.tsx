import BudgetPreviewSection from "./components/layout/BudgetPreview";
import Calendar from "./components/layout/Calendar";
import SelectedDayTransaction from "./components/layout/SelectedDayTransaction";
import CategoryBreakdown from "./components/layout/CetegoryBreakdown";
import Navbar from "./components/layout/Navbar";

function App() {
  return (
    <div className="app">
      <Navbar />
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
