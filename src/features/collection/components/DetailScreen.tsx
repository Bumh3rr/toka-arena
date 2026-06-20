// src/features/collection/components/DetailScreen.tsx
import type { CSSProperties } from 'react'
import type { CollectionData } from '../types/collection.types'
import { RARITY_META } from '@/shared/constants/rarity'
import { COL_SPECIES_LABEL } from '../types/collection.types'
import { Button, ProgressBar } from '@/shared/ui/Kit'
import StatBox from './StatBox'
import AbilityRow from './AbilityRow'
import AccSlot from './AccSlot'
import styles from './DetailScreen.module.css'

interface DetailScreenProps {
  tokaId: string
  data: CollectionData
  expandedAbility: number | null
  onBack: () => void
  onToggleFav: (id: string, fav: boolean) => void
  onActivate: (id: string) => void
  onToggleAbility: (idx: number) => void
}

const EVO_NEXT: Record<string, string> = {
  COMMON: 'Raro', RARE: 'Épico', EPIC: 'Legendario',
}
const EVO_CP: Record<string, number> = { COMMON: 200, RARE: 400, EPIC: 600 }
const EVO_TF: Record<string, number> = { COMMON: 20, RARE: 35, EPIC: 50 }

export default function DetailScreen({
  tokaId, data, expandedAbility,
  onBack, onToggleFav, onActivate, onToggleAbility,
}: DetailScreenProps) {
  const tk = data.roster.find(t => t.id === tokaId)
  if (!tk) return null

  const meta = RARITY_META[tk.rarity]
  const isActive = tk.id === data.activeTokaId
  const roster = data.roster
  const idx = roster.findIndex(t => t.id === tk.id)

  const headAcc = data.accessories.find(a => a.slot === 'cabeza' && a.equipped.includes(tk.id) && !a.locked)
  const bodyAcc = data.accessories.find(a => a.slot === 'cuerpo' && a.equipped.includes(tk.id) && !a.locked)

  const nextRar = EVO_NEXT[tk.rarity]
  const evoCp = EVO_CP[tk.rarity]
  const evoTf = EVO_TF[tk.rarity]
  const cpPct = evoCp ? Math.min(100, Math.round((tk.cp / evoCp) * 100)) : 100

  return (
    <div className={styles.screen}>
      {/* Hero */}
      <div
        className={styles.hero}
        style={{ '--glow': meta.ring, '--glow-soft': meta.soft } as CSSProperties}
      >
        <div className={styles.topbar}>
          <button className={styles.backBtn} onClick={onBack} aria-label="Volver">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <button
            className={`${styles.favBtn} ${tk.fav ? styles.favOn : ''}`}
            onClick={() => onToggleFav(tk.id, !tk.fav)}
            aria-label={tk.fav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3l2.3 6.2 6.5 0-5.2 4.1 1.9 6.3L12 15.8l-5.5 3.8 1.9-6.3-5.2-4.1 6.5 0z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.char}>
          <img
            src={`/assets/tokagotchis/png/${tk.species.toLowerCase()}.png`}
            alt={tk.nick}
          />
        </div>

        {roster.length > 1 && (
          <div className={styles.dots} aria-hidden="true">
            {roster.map((t, i) => (
              <span key={t.id} className={`${styles.dot} ${i === idx ? styles.dotOn : ''}`} />
            ))}
          </div>
        )}
      </div>

      {/* Info card */}
      <div className={styles.card}>
        <div className={styles.grab} aria-hidden="true" />

        {/* Identity */}
        <div className={styles.identity}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{tk.nick}</span>
          </div>
          <div className={styles.idRow}>
            <span className={styles.rarBadge} style={{ background: meta.ring }}>
              {meta.label}
            </span>
            <span className={styles.species}>{COL_SPECIES_LABEL[tk.species]}</span>
          </div>
        </div>

        {/* Stats */}
        <h3 className={styles.secHeader}>Estadísticas</h3>
        <div className={styles.statsGrid}>
          <StatBox label="HP"  value={tk.stats.hp}  color="#46A8DC" />
          <StatBox label="ATK" value={tk.stats.atk} color="#F08A4B" />
          <StatBox label="DEF" value={tk.stats.def} color="#6FC04A" />
          <StatBox label="NRG" value={tk.stats.nrg} color="#9D74D6" />
        </div>

        {/* Abilities */}
        <h3 className={styles.secHeader}>Habilidades</h3>
        <div className={styles.abilities}>
          {tk.abilities.map((ab, i) => (
            <AbilityRow
              key={ab.name}
              ability={ab}
              idx={i}
              expanded={expandedAbility === i}
              onToggle={onToggleAbility}
            />
          ))}
        </div>

        {/* Evolution */}
        {nextRar && (
          <>
            <h3 className={styles.secHeader}>Evolución</h3>
            <div className={styles.evo}>
              <p className={styles.evoTitle}>Ascender a {nextRar}</p>
              <div className={styles.evoBarWrap}>
                <div className={styles.evoBarTop}>
                  <span>CP</span>
                  <b>{tk.cp}/{evoCp}</b>
                </div>
                <ProgressBar
                  pct={cpPct}
                  color="linear-gradient(180deg,#8FD96A,var(--green))"
                />
              </div>
              <p className={styles.evoCost}>Costo: {evoTf} TF</p>
            </div>
          </>
        )}

        {/* Accessory slots */}
        <h3 className={styles.secHeader}>Accesorios equipados</h3>
        <div className={styles.slots}>
          <AccSlot label="Cabeza"  acc={headAcc} />
          <AccSlot label="Cuerpo"  acc={bodyAcc} />
          <AccSlot label="Cara"    future />
          <AccSlot label="Espalda" future />
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {isActive ? (
            <div className={styles.activeBadge}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 13l4 4L19 7"/>
              </svg>
              Tokagotchi activo
            </div>
          ) : (
            <Button
              variant="green"
              size="lg"
              fullWidth
              onClick={() => onActivate(tk.id)}
            >
              Activar como principal
            </Button>
          )}
          <p className={styles.origin}>Origen: {tk.origin}</p>
        </div>

        <div style={{ height: 18 }} />
      </div>
    </div>
  )
}
