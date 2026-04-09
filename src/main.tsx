import { createRoot } from 'react-dom/client'
import './index.css'
//import App from './App'
//import TestPage from './pages/test/PagosTest'
import GetAuthCode from './pages/test/GetAuthCode'

createRoot(document.getElementById('root')!).render(
    <GetAuthCode />
    //<App />
    //<TestPage />
)
