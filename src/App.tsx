import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Accesorios from './pages/Accesorios'
import Arena from './pages/Arena'
import { useState } from 'react'

const TOKAGOTCHI = [
    { label: 'Tofu', toka: "tofu" },
    { label: 'Mochi', toka: "mochi" },
    { label: 'Hana', toka: "hana" }
]

export default function App() {
      const [tokagotchiSeleccionado, setTokagotchiSeleccionado] = useState(TOKAGOTCHI[0].toka)
  return (
    <Routes>
      <Route path="/" element={<Home tokagotchiSeleccionado={tokagotchiSeleccionado} setTokagotchiSeleccionado={setTokagotchiSeleccionado} tokagotchis={TOKAGOTCHI} />} />
      <Route path="/tokagotchi-accesorios" element={<Accesorios tokagotchi={tokagotchiSeleccionado} />} />
      <Route path="/arena" element={<Arena />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}