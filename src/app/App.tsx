import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { tokenStore } from '@/shared/player/lib/token.store'
import AppLayout from './layout/AppLayout/AppLayout'
import LoginPage from '@/features/auth/pages/LoginPage'
import UnboxingPage from '@/features/unboxing/pages/UnboxingPage'
import ArenaPage from '@/features/arena/pages/ArenaPage'
import ColeccionPage from '@/features/collection/pages/CollectionPage'
import ShopPage from '@/features/shop/pages/ShopPage'
import HomePage from '@/features/home/pages/HomePage'
import UIKitPage from '@/features/devkit/pages/UIKitPage'
import SessionWatcher from '@/features/auth/components/SessionWatcher'
import PassPage from '@/features/pass/page/PassPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return tokenStore.exists()
    ? <>{children}</>
    : <Navigate to="/login" replace />
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
          <Route path="/collection" element={<ColeccionPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/ui-kit" element={<UIKitPage />} />
          <Route path="/arena" element={<ArenaPage />} />
          <Route path="/pass" element={<PassPage />} />
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
