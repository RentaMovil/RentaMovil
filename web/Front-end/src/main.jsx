import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '../src/Traductions/index.js'

import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ReservationProvider } from './features/booking/context/ReservationContext.jsx'
import { PaymentProvider } from './features/payment/context/PaymentContext.jsx'
import DialogProvider from './shared/components/dialog/DialogProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DialogProvider>
      <AuthProvider>
        <ReservationProvider>
          <PaymentProvider>
            <App />
          </PaymentProvider>
        </ReservationProvider>
      </AuthProvider>
    </DialogProvider>
  </StrictMode>,
)