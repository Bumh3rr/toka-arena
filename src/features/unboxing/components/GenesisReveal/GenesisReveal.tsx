import { useState, type CSSProperties } from 'react'
import TokagotchiCanvas from '@/shared/canvas/TokagotchiCanvas'
import { Button } from '@/shared/ui/Kit'
import { IcPencil } from '@/shared/ui/Icons/Icons'
import RenameModal from '@/shared/ui/modal/RenameModal'
import { RARITY_META } from '@/shared/constants/rarity'
import type { Tokagotchi, Rarity } from '@/shared/domain/tokagotchi'
import styles from './GenesisReveal.module.css'
import { FLAVOR, SPECIES_LABEL } from '@/shared/constants/tokagotchi'

// Posiciones fijas de las sparkles alrededor del héroe.
const SPARKLE_POS: CSSProperties[] = [
  { top: '6%', left: '20%' },
  { top: '16%', left: '50%' },
  { top: '12%', right: '16%' },
  { top: '46%', left: '4%' },
  { top: '40%', right: '6%' },
  { top: '74%', left: '24%' },
  { top: '70%', right: '22%' },
]
// Cantidad de sparkles por rareza (Legendario, más ceremonia).
const SPARKLE_COUNT: Record<Rarity, number> = { COMMON: 4, RARE: 5, EPIC: 6, LEGENDARY: 7 }

interface GenesisRevealProps {
  tokagotchi: Tokagotchi
  onStart: () => void
  onRename: (newName: string) => void
}

export default function GenesisReveal({ tokagotchi, onStart, onRename }: GenesisRevealProps) {
  const [renameOpen, setRenameOpen] = useState(false)
  const meta = RARITY_META[tokagotchi.rarity]
  const isLegendary = tokagotchi.rarity === 'LEGENDARY'

  const themeVars = {
    '--glow-color': meta.ring,
    '--glow-soft': meta.soft,
  } as CSSProperties

  const sparkles = SPARKLE_POS.slice(0, SPARKLE_COUNT[tokagotchi.rarity])

  return (
    <div className={styles.overlay} style={themeVars}>
      <div className={styles.content}>
        {/* 1. Título */}
        <header className={`${styles.header} ${styles.enter}`} style={{ animationDelay: '0s' }}>
          <h1 className={styles.title}>¡Es tuyo!</h1>
          <p className={styles.subtitle}>Tu primer compañero de aventura</p>
        </header>

        {/* 2. Héroe */}
        <div className={`${styles.hero} ${styles.enter}`} style={{ animationDelay: '.3s' }}>
          <div className={styles.glow} aria-hidden="true" />
          <div className={styles.sparkles} aria-hidden="true">
            {sparkles.map((pos, i) => (
              <span
                key={i}
                className={`${styles.sparkle} ${isLegendary ? styles.sparkleGold : ''}`}
                style={{ ...pos, animationDelay: `${0.4 + i * 0.33}s` }}
              />
            ))}
          </div>
          <div className={styles.floaty}>
            <TokagotchiCanvas width={210} height={210} species={tokagotchi.species} animacionActual="idle" />
          </div>
        </div>

        {/* 3. Identidad */}
        <div className={`${styles.identity} ${styles.enter}`} style={{ animationDelay: '.5s' }}>
          <div className={styles.nameRow}>
            <span className={styles.name}>{tokagotchi.name}</span>
            <button className={styles.pencil} onClick={() => setRenameOpen(true)} aria-label="Renombrar">
              <IcPencil />
            </button>
          </div>
          <div className={styles.badges}>
            <span
              className={`${styles.rarBadge} ${isLegendary ? styles.rarBadgeLegend : ''}`}
              style={{ background: meta.ring }}
            >
              {meta.label}
            </span>
            <span className={styles.species}>{SPECIES_LABEL[tokagotchi.species]}</span>
          </div>
        </div>

        {/* 4. Flavor */}
        <p className={`${styles.flavor} ${styles.enter}`} style={{ animationDelay: '.65s' }}>
          {FLAVOR[tokagotchi.species]}
        </p>

        {/* 5. CTA */}
        <div className={`${styles.cta} ${styles.enter}`} style={{ animationDelay: '1.1s' }}>
          <Button  variant="cream" size="lg" fullWidth onClick={onStart}>
            ¡Comenzar la aventura!
          </Button>
        </div>
      </div>

      {renameOpen && (
        <RenameModal
          currentName={tokagotchi.name}
          onSave={async (name) => { onRename(name) }}
          onClose={() => setRenameOpen(false)}
        />
      )}
    </div>
  )
}
