import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { authService } from './services/authService'
import AppLayout from './components/AppLayout/AppLayout'
import LoginPage from './pages/Login/LoginPage'
import UnboxingPage from './pages/Unboxing/UnboxingPage'
import HomePage from './pages/Home/HomePage'
import MisionesPage from './pages/Misiones/MisionesPage'
import ArenaPage from './pages/Arena/ArenaPage'
import ColeccionPage from './pages/Coleccion/ColeccionPage'
import TiendaPage from './pages/Tienda/TiendaPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return authService.isAuthenticated()
    ? <>{children}</>
    : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas — sin nav */}
        <Route path="/login" element={<LoginPage />} />
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