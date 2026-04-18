import { useState } from 'react'
import TokagotchiCanvas from '../components/TokagotchiCanvas'
import { useNavigate } from 'react-router-dom'

const ACCESORIOS_CABEZA = [
    { label: 'Sin accesorio', index: -1 },
    { label: 'Casco', index: 0 },
    { label: 'Corona', index: 1 },
    { label: 'Sombrero', index: 2 },
]

const ANIMACIONES = [
    { label: 'Movimiento', animation: "idle" },
    { label: 'Ataque', animation: "ataque" },
    { label: 'Comer', animation: "comer" },
    { label: 'Bañar', animation: "bañar" },
    { label: 'Curación', animation: "curacion" },
    { label: 'Daño', animation: "daño" },
    { label: 'Jugar', animation: "jugar" }
]

const ACCESORIOS_CUERPO = [
    { label: 'Sin accesorio', index: -1 },
    { label: 'Capa', index: 0 }
]

interface Props {
    tokagotchi: string
}

export default function Accesorios({ tokagotchi }: Props) {
    const [accesorioIndexCabeza, setAccesorioIndexCabeza] = useState(-1)
    const [accesorioIndexCuerpo, setAccesorioIndexCuerpo] = useState(-1)
    const [animacionActual, setAnimacionActual] = useState("idle")
    const [reverse, setReverse] = useState(false)
    const navigate = useNavigate()

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 24 }}>
            <h2>Tokagotchi</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button onClick={() => { navigate('/') }}>
                    Volver a Home
                </button>
                <button onClick={() => {
                    setAccesorioIndexCabeza(-1)
                    setAccesorioIndexCuerpo(-1)
                    setAnimacionActual("idle")
                }} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #534AB7', color: '#534AB7', fontWeight: 600 }}>
                    Resetear
                </button>
            </div>

            <TokagotchiCanvas
                accesorioIndexCabeza={accesorioIndexCabeza}
                accesorioIndexCuerpo={accesorioIndexCuerpo}
                animacionActual={animacionActual}
                tokaActual={tokagotchi}
                reverse={reverse} />

            {/* Controles */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                    onClick={() => setReverse(!reverse)}
                    style={{
                        padding: '8px 16px',
                        background: reverse ? '#534AB7' : 'transparent',
                        color: reverse ? 'white' : 'inherit',
                        border: '1px solid #534AB7',
                        borderRadius: 8,
                        cursor: 'pointer'
                    }}
                >
                    {reverse ? 'Voltear a normal' : 'Voltear horizontalmente'}
                </button>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                {ANIMACIONES.map((antm) => (
                    <button
                        key={antm.animation}
                        onClick={() => setAnimacionActual(antm.animation)}
                        style={{
                            padding: '8px 16px',
                            background: animacionActual === antm.animation ? '#534AB7' : 'transparent',
                            color: animacionActual === antm.animation ? 'white' : 'inherit',
                            border: '1px solid #534AB7',
                            borderRadius: 8,
                            cursor: 'pointer'
                        }}
                    >
                        {antm.label}
                    </button>
                ))}
            </div>

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
