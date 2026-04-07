import { useState } from 'react'
import TokagotchiCanvas from './components/TokagotchiCanvas'

const ACCESORIOS_CABEZA = [
  { label: 'Sin accesorio', index: -1 },
  { label: 'Accesorio 1', index: 0 },
  { label: 'Accesorio 2', index: 1 },
  { label: 'Accesorio 3', index: 2 },
]


const ACCESORIOS_CUERPO = [
  { label: 'Sin accesorio', index: -1 },
  { label: 'Capa', index: 0 }
]

export default function App() {
  const [accesorioIndexCabeza, setAccesorioIndexCabeza] = useState(-1)
  const [accesorioIndexCuerpo, setAccesorioIndexCuerpo] = useState(-1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 24 }}>
      <h2>Tokagotchi</h2>

      <TokagotchiCanvas accesorioIndexCabeza={accesorioIndexCabeza} accesorioIndexCuerpo={accesorioIndexCuerpo} />

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {ACCESORIOS_CABEZA.map((acc) => (
          <button
            key={acc.index}
            onClick={() => setAccesorioIndexCabeza(acc.index)}
            style={{
              padding: '8px 16px',
              background: accesorioIndexCabeza === acc.index ? '#534AB7' : 'transparent',
              color: accesorioIndexCabeza === acc.index ? 'white' : 'inherit',
              border: '1px solid #534AB7',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            {acc.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {ACCESORIOS_CUERPO.map((acc) => (
          <button
            key={acc.index}
            onClick={() => setAccesorioIndexCuerpo(acc.index)}
            style={{
              padding: '8px 16px',
              background: accesorioIndexCuerpo === acc.index ? '#534AB7' : 'transparent',
              color: accesorioIndexCuerpo === acc.index ? 'white' : 'inherit',
              border: '1px solid #534AB7',
              borderRadius: 8,
              cursor: 'pointer'
            }}
          >
            {acc.label}
          </button>
        ))}
      </div>
    </div>
  )
}