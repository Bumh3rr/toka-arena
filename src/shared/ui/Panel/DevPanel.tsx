import React, { useState } from 'react'
import { IcTerminal, IcChevR } from '@/shared/ui/Icons/Icons'
import type { Species, Rarity } from '@/shared/domain/tokagotchi'
import styles from './DevPanel.module.css'
import { useAuth } from '@/shared/session/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

// ── Constantes ────────────────────────────────────────────────────────────────
const ESPECIES: Species[] = ['TOFU', 'MOCHI', 'HANA']
const RAREZAS: { value: Rarity; label: string }[] = [
    { value: 'COMMON', label: 'C' },
    { value: 'RARE', label: 'R' },
    { value: 'EPIC', label: 'É' },
    { value: 'LEGENDARY', label: 'L' },
]
type Ambiente = 'auto' | 'amanecer' | 'dia' | 'atardecer' | 'noche'
const opcionesAmbiente: { value: Ambiente; label: string }[] = [
    { value: 'auto', label: 'Automatico' },
    { value: 'amanecer', label: 'Amanecer' },
    { value: 'dia', label: 'Día' },
    { value: 'atardecer', label: 'Atardecer' },
    { value: 'noche', label: 'Noche' },
]

// ── Sub-componentes internos ──────────────────────────────────────────────────
function DvField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className={styles.dvField}>
            <span className={styles.dvLabel}>{label}</span>
            <div className={styles.dvControl}>{children}</div>
        </div>
    )
}

function DvBtn({ children, onClick, tone }: { children: React.ReactNode; onClick: () => void; tone?: 'go' | 'warn' | 'danger' }) {
    const toneClass = tone === 'go' ? styles.dvBtnGo : tone === 'warn' ? styles.dvBtnWarn : tone === 'danger' ? styles.dvBtnDanger : ''
    return <button className={`${styles.dvBtn} ${toneClass}`} onClick={onClick}>{children}</button>
}

function DvSeg<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
    return (
        <div className={styles.dvSeg}>
            {options.map(o => (
                <button key={o.value}
                    className={`${styles.dvSegBtn} ${value === o.value ? styles.dvSegOn : ''}`}
                    onClick={() => onChange(o.value)}>
                    {o.label}
                </button>
            ))}
        </div>
    )
}

// ── DevPanel ──────────────────────────────────────────────────────────────────
export default function DevPanel() {
    const [open, setOpen] = useState(false)
    const [ambiente, setAmbiente] = useState<Ambiente>('auto')
    const [tf, setTf] = useState(1500)
    const [cp, setCp] = useState(0)
    const [rarity, setRarity] = useState<Rarity>('COMMON')
    const [giveSpecies, setGiveSpecies] = useState<Species>('TOFU')
    const [giveRarity, setGiveRarity] = useState<Rarity>('COMMON')
    const navigate = useNavigate()
    const { logout } = useAuth()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className={styles.wrap}>
            <div className={styles.devPanel}>
                {/* header colapsable */}
                <button className={styles.dvHeader} onClick={() => setOpen(o => !o)}>
                    <span className={styles.dvBadge}><IcTerminal /> DEV</span>
                    <span className={styles.dvTitle}>Herramientas de desarrollo</span>
                    <span className={`${styles.dvChev} ${open ? styles.dvChevOpen : ''}`}><IcChevR /></span>
                </button>

                {open && (
                    <div className={styles.dvBody}>
                        <div className={styles.dvSec}>Entorno</div>
                        <DvField label="Ambiente / hora">
                            <DvSeg value={ambiente} onChange={setAmbiente}
                                options={opcionesAmbiente} />
                        </DvField>

                        <div className={styles.dvSec}>Economía</div>
                        <DvField label={`TF — ${tf.toLocaleString()}`}>
                            <DvBtn onClick={() => setTf(t => t + 100)}>+100</DvBtn>
                            <DvBtn onClick={() => setTf(t => t + 1000)}>+1000</DvBtn>
                            <DvBtn tone="warn" onClick={() => setTf(t => Math.max(0, t - 100))}>−100</DvBtn>
                        </DvField>

                        <div className={styles.dvSec}>Tokagotchi activo</div>
                        <DvField label={`CP — ${cp}`}>
                            <DvBtn onClick={() => setCp(0)}>0</DvBtn>
                            <DvBtn onClick={() => setCp(420)}>420</DvBtn>
                            <DvBtn onClick={() => setCp(600)}>Máx</DvBtn>
                        </DvField>
                        <DvField label="Rareza">
                            <DvSeg value={rarity} onChange={setRarity} options={RAREZAS} />
                        </DvField>
                        <DvField label="Evolución">
                            <DvBtn tone="go" onClick={() => { }}>Forzar ascensión</DvBtn>
                            <DvBtn onClick={() => { }}>Reset cooldowns</DvBtn>
                        </DvField>

                        <div className={styles.dvSec}>Otorgar Tokagotchi</div>
                        <DvField label="Especie">
                            <DvSeg value={giveSpecies} onChange={setGiveSpecies}
                                options={ESPECIES.map(s => ({ value: s, label: s }))} />
                        </DvField>
                        <DvField label="Rareza">
                            <DvSeg value={giveRarity} onChange={setGiveRarity} options={RAREZAS} />
                        </DvField>
                        <DvField label="">
                            <DvBtn tone="go" onClick={() => { }}>+ Otorgar</DvBtn>
                        </DvField>

                        <div className={styles.dvSec}>Peligro</div>
                        <DvField label="">
                            <DvBtn tone="danger" onClick={() => { setTf(0); setCp(0) }}>Resetear progreso</DvBtn>
                        </DvField>

                        <div className={styles.dvSec}>Logout</div>
                        <DvField label="">
                            <DvBtn tone="danger" onClick={() => { handleLogout() }}>Cerrar sesión</DvBtn>
                        </DvField>
                    </div>
                )}
            </div>
        </div>
    )
}
