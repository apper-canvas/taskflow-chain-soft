import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App.jsx'
import './index.css'

// Initialize the root and render the app
ReactDOM.createRoot(document.getElementById('root')).render(
  // Provide Redux store to entire application
  <Provider store={store}>
    {/* BrowserRouter for routing */}
    <BrowserRouter>
      {/* Main App component */}
      <App />
    </BrowserRouter>
  </Provider>
)