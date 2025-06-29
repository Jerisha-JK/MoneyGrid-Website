import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { IncomeProvider } from './FrontEnd/Section/Income/IncomeContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <IncomeProvider>

  
    <App />
  </IncomeProvider>
  </BrowserRouter>,
)
