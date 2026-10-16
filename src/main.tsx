import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HashRouter } from 'react-router-dom'
import TransactionsProvider from './context/TransactionsProvider.tsx'
import DebtsProvider from './context/DebtsProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <TransactionsProvider>
        <DebtsProvider>
          <App />
        </DebtsProvider>
      </TransactionsProvider>
    </HashRouter>
  </StrictMode>,
)
