import { Link } from 'react-router-dom'

interface Props {
    tokagotchiSeleccionado: string
    setTokagotchiSeleccionado: (toka: string) => void,
    tokagotchis: { label: string, toka: string }[]
}

export default function Home({ tokagotchiSeleccionado, setTokagotchiSeleccionado, tokagotchis }: Props) {

    return (
        <main style={{ padding: 24, display: 'grid', gap: 16, justifyItems: 'center' }}>
            <h1>Toka Arena</h1>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 12 }}>
                <Link
                    to="/tokagotchi-accesorios"
                    style={{
                        padding: '10px 16px',
                        borderRadius: 8,
                        textDecoration: 'none',
                        border: '1px solid #534AB7',
                        color: '#534AB7',
                        fontWeight: 600,
                    }}
                >
                    Ir a Tokagotchi Accesorios
                </Link>

                {/* Elegir al Tokagotchi para ver los Accesorios */}
                <select style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #534AB7' }} value={tokagotchiSeleccionado} onChange={(e) => setTokagotchiSeleccionado(e.target.value)}>
                    {tokagotchis.map((toka) => (
                        <option key={toka.toka} value={toka.toka}>
                            {toka.label}
                        </option>
                    ))}
                </select>

            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <Link to="/arena" style={{ padding: '10px 16px', borderRadius: 8, textDecoration: 'none', border: '1px solid #534AB7', color: '#534AB7', fontWeight: 600 }}>
                    Ir a Arena
                </Link>
            </div>

        </main>
    )
}
