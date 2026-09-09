import { Button } from '@/shared/ui/Kit'
import { IcLock } from '@/shared/ui/Icons/Icons'
import { getSpeciesImageSrc } from '@/shared/game/assets'
import type { Species } from '@/shared/domain/tokagotchi'
import type { ArenaModeTheme } from '../../types/arena.types'
import styles from './LobbyActionBar.module.css'

interface LobbyActionBarProps {
  theme: ArenaModeTheme
  /** Hay estamina suficiente para pelear. */
  hasStamina: boolean
  /** Estamina y modo habilitado: el CTA responde. */
  canBattle: boolean
  onChangeToka: () => void
  onOpenMode: () => void
  onBattle: () => void
}

/** Especies que se apilan en el botón de cambiar tokagotchi. */
const DECK_SPECIES: Species[] = ['TOFU', 'MOCHI', 'HANA']

/**
 * Copy y color del CTA según por qué se puede (o no se puede) pelear.
 *
 * Un modo bloqueado conserva su acento — se lee como la arena que es, solo que
 * candada. La falta de estamina sí apaga el botón a crema: ahí el problema no
 * es el modo, es el jugador.
 */
function resolveCta(theme: ArenaModeTheme, hasStamina: boolean) {
  if (!theme.enabled) {
    return { label: theme.cta.label, hint: 'Próximamente', locked: true, variant: theme.accent }
  }
  if (!hasStamina) {
    return { label: 'Sin estamina', hint: 'Recarga para pelear', locked: false, variant: 'cream' as const }
  }
  return { label: theme.cta.label, hint: theme.cta.hint, locked: false, variant: theme.accent }
}

/**
 * Fila inferior del lobby: cambiar de tokagotchi · pelear · elegir modo.
 *
 * El CTA central toma su color del modo activo, así que cambiar de arena
 * repinta la barra sin ninguna condición extra aquí.
 */
export default function LobbyActionBar({
  theme,
  hasStamina,
  canBattle,
  onChangeToka,
  onOpenMode,
  onBattle,
}: LobbyActionBarProps) {
  const cta = resolveCta(theme, hasStamina)

  return (
    <div className={styles.bar}>
      {/* Cambiar tokagotchi */}
      <button className={styles.deck} onClick={onChangeToka} aria-label="Cambiar tokagotchi">
        <span className={styles.deckTag}>Cambiar</span>
        <span className={styles.deckStack}>
          {DECK_SPECIES.map((species) => (
            <span key={species} className={styles.deckAvatar}>
              <img src={getSpeciesImageSrc(species)} alt="" />
            </span>
          ))}
        </span>
      </button>

      {/* Pelear */}
      <Button
        variant={cta.variant}
        size="lg"
        radius="lg"
        fullWidth
        disabled={!canBattle}
        onClick={onBattle}
        className={styles.cta}
      >
        <span className={styles.ctaInner}>
          <span className={styles.ctaLabel}>{cta.label}</span>
          <span className={styles.ctaHint}>
            {cta.locked && <span className={styles.ctaLock}><IcLock /></span>}
            {cta.hint}
          </span>
        </span>
      </Button>

      {/* Elegir modo */}
      <button className={styles.mode} onClick={onOpenMode} aria-label={`Modo ${theme.label}. Cambiar de modo`}>
        <img src={theme.cup} alt="" className={styles.modeCup} />
        <span className={styles.modeLabel}>{theme.label}</span>
      </button>
    </div>
  )
}
