import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { tokenStore } from '@/shared/session/store/token.store'
import SessionWatcher from '@/shared/session/components/SessionWatcher'
import AppLayout from './layout/AppLayout/AppLayout'
import LoginPage from '@/features/auth/pages/LoginPage'
import UnboxingPage from '@/features/unboxing/pages/UnboxingPage'
import ArenaPage from '@/features/arena/pages/ArenaPage'
import ColeccionPage from '@/features/collection/pages/CollectionPage'
import TiendaPage from '@/features/shop/pages/ShopPage'
import HomePage from '@/features/home/pages/HomePage'
import UIKitPage from '@/features/devkit/pages/UIKitPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  /** 
  return tokenStore.exists()
    ? <>{children}</>
    : <Navigate to="/login" replace />
*/
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <SessionWatcher />
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
          <Route path="/coleccion" element={<ColeccionPage />} />
          <Route path="/tienda" element={<TiendaPage />} />
          <Route path="/ui-kit" element={<UIKitPage />} />
          <Route path="/arena" element={<ArenaPage />} />
        </Route>

        <Route path="/" element={
          tokenStore.exists()
            ? <Navigate to="/home" replace />
            : <Navigate to="/login" replace />
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
