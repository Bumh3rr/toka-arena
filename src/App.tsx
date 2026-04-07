import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { authService } from './services/authService'
import LoginPage from './pages/Login/LoginPage'
import UnboxingPage from './pages/Unboxing/UnboxingPage'
import HomePage from './pages/Home/HomePage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return authService.isAuthenticated()
    ? <>{children}</>
    : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/unboxing" element={
          <PrivateRoute>
            <UnboxingPage />
          </PrivateRoute>
        } />

        <Route path="/home" element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        } />

        <Route path="/" element={
          authService.isAuthenticated()
            ? <Navigate to="/home" replace />
            : <Navigate to="/login" replace />
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}