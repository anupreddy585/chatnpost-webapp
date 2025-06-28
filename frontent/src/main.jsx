import { createRoot } from 'react-dom/client'
import './index.css'
import store from './store.js'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
    <Toaster />
  </Provider>,
)
