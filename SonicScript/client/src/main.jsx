import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from './context/AppContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
      <App />
      {/* Global toast notifications — styled to match our dark AI aesthetic */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(15, 15, 25, 0.95)',
            color: '#e4e4e7',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(16px)',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: "'Inter', system-ui, sans-serif",
            padding: '12px 16px',
          },
          success: {
            iconTheme: { primary: '#34d399', secondary: '#0a0a0f' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#0a0a0f' },
          },
        }}
      />
    </AppProvider>
  </StrictMode>,
)

