import { useState, type CSSProperties } from 'react'
import { RARITY_META } from '@/shared/constants/rarity'
import { Button, IconButton, Label, ProgressBar } from '@/shared/ui/Kit'
import AbilityRow from './AbilityRow'
import AccSlot from './AccSlot'
import styles from './DetailScreen.module.css'
import StatsRow from '@/features/home/components/row/StatsRow'
import RarityCard from '@/shared/ui/RarityCard/RarityCard'
import { IcPencil } from '@/shared/ui/Icons/Icons'
import type { Tokagotchi } from '@/shared/domain/tokagotchi'

interface DetailScreenProps {
  isActivo: boolean
  tokagotchi: Tokagotchi
  expandedAbility: number | null
  onBack: () => void
  onToggleFav: (id: string, fav: boolean) => void
  onActivate: (id: string) => void
  onToggleAbility: (idx: number) => void
}

export default function DetailScreen({
  isActivo, tokagotchi, expandedAbility,
  onBack, onToggleFav, onActivate, onToggleAbility,
}: DetailScreenProps) {
  const [isFav, setIsFav] = useState(false)

  const meta = RARITY_META[tokagotchi.rarity]
  const isActive = isActivo

  const headAcc = undefined
  const bodyAcc = undefined

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
            className={`${styles.favBtn} ${isFav ? styles.favOn : ''}`}
            onClick={() => {
              setIsFav(!isFav)
              onToggleFav(tokagotchi.id, !isFav)
            }}
            aria-label={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3l2.3 6.2 6.5 0-5.2 4.1 1.9 6.3L12 15.8l-5.5 3.8 1.9-6.3-5.2-4.1 6.5 0z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.char}>
          <img
            src={`/assets/tokagotchis/png/${tokagotchi.species.toLowerCase()}.png`}
            alt={tokagotchi.id}
          />
        </div>

      </div>

      {/* Info card */}
      <div className={styles.card}>
        <div className={styles.grab} aria-hidden="true" />

        {/* Identity */}
        <div className={styles.identity}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{tokagotchi.name}</span>
            <IconButton
              shape='sm'
              size={28}
              onClick={() => {}}
              aria-label="Renombrar"
            >
            <IcPencil />
            </IconButton>
          </div>
          <div className={styles.idRow}>
            <RarityCard rarity={tokagotchi.rarity}/>
            <span>|</span>
            <Label variant="warm" look="soft" size="sm">{tokagotchi.species}</Label>
          </div>
        </div>

        {/* Stats */}
        <StatsRow stats={tokagotchi.stats}></StatsRow>

        {/* Abilities */}
        <h3 className={styles.secHeader}>Habilidades</h3>
        <div className={styles.abilities}>
          {/** 
          {tokagotchi.abilities.map((ab, i) => (
            <AbilityRow
              key={ab.name}
              ability={ab}
              idx={i}
              expanded={expandedAbility === i}
              onToggle={onToggleAbility}
            />
          ))}
            */}
        </div>

        {/* Evolution */}
        {tokagotchi.nextEvolution && (
          <>
            <h3 className={styles.secHeader}>Evolución</h3>
            <div className={styles.evo}>
              <p className={styles.evoTitle}>Ascender a {tokagotchi.nextEvolution?.nextRarity}</p>
              <div className={styles.evoBarWrap}>
                <div className={styles.evoBarTop}>
                  <span>CP</span>
                  <b>{tokagotchi.cp}/{tokagotchi.nextEvolution?.cpRequired}</b>
                </div>
                <ProgressBar
                  pct={77}
                  color="linear-gradient(180deg,#8FD96A,var(--green))"
                />
              </div>
              <p className={styles.evoCost}>Costo: {tokagotchi.nextEvolution?.tfRequired} TF</p>
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
              onClick={() => onActivate(tokagotchi.id)}
            >
              Activar como principal
            </Button>
          )}
          <p className={styles.origin}>Origen: Desconocido</p>
        </div>

        <div style={{ height: 18 }} />
      </div>
    </div>
  )
}
