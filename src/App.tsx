import { useState } from 'react'
import TokagotchiCanvas from './components/TokagotchiCanvas'

const ACCESORIOS = [
  { label: 'Sin accesorio', index: 0 },
  { label: 'Accesorio 1', index: 1 },
  { label: 'Accesorio 2', index: 2 },
  { label: 'Accesorio 3', index: 3 },
]

export default function App() {
  const [accesorioIndex, setAccesorioIndex] = useState(0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 24 }}>
      <h2>Tokagotchi</h2>

      <TokagotchiCanvas accesorioIndex={accesorioIndex} />

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {ACCESORIOS.map((acc) => (
          <button
            key={acc.index}
            onClick={() => setAccesorioIndex(acc.index)}
            style={{
              padding: '8px 16px',
              background: accesorioIndex === acc.index ? '#534AB7' : 'transparent',
              color: accesorioIndex === acc.index ? 'white' : 'inherit',
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