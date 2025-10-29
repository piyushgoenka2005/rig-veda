import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Render outside of StrictMode to avoid double-effect execution (required by Turn.js)
ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
