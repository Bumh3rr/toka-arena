import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { authService } from './services/authService'
import AppLayout from './components/AppLayout/AppLayout'
import LoginPage from './pages/Login/LoginPage'
import UnboxingPage from './pages/Unboxing/UnboxingPage'
import HomePage from './pages/Home/HomePage'
import MisionesPage from './pages/Misiones/MisionesPage'
import ArenaPage from './pages/Arena/ArenaPage'
import ColeccionPage from './pages/Coleccion/ColeccionPage'
import TiendaPage from './pages/Tienda/TiendaPage'
import { getAuthCodeFromURL } from './services/tokaAuth'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return authService.isAuthenticated()
    ? <>{children}</>
    : <Navigate to="/login" replace />
}

export default function App() {
  const [authCode] = useState<string | null>(() => getAuthCodeFromURL())

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas — sin nav */}
        <Route path="/login" element={<LoginPage authCode={authCode} />} />
        <Route path="/unboxing" element={
          <PrivateRoute>
            <UnboxingPage />
          </PrivateRoute>
        } />

        {/* Rutas protegidas — con nav */}
        <Route element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }>
          <Route path="/home" element={<HomePage />} />
          <Route path="/misiones" element={<MisionesPage />} />
          <Route path="/arena" element={<ArenaPage />} />
          <Route path="/coleccion" element={<ColeccionPage />} />
          <Route path="/tienda" element={<TiendaPage />} />
        </Route>

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
