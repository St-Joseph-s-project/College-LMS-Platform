import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { ToastContainer, Flip } from 'react-toastify';
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary';

console.log("Main entry point executing...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("CRITICAL: Root element not found!");
} else {
  console.log("Root element found, mounting React app...");
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Flip}
          />
        </Provider>
      </ErrorBoundary>
    </StrictMode>,
  )
}
