import { Label } from '@/shared/ui/Kit'
import type { Skill } from '../../../types/arena.types'
import styles from './SkillGrid.module.css'

interface SkillGridProps {
  skills: Skill[]
  /** Energía disponible, para saber qué se puede pagar. */
  energy: number
  /** false ⇒ no es tu turno: todo apagado. */
  enabled: boolean
  onUse: (skill: Skill) => void
  /** Se llama al mantener el dedo encima, para previsualizar el coste. */
  onPreview: (cost: number | undefined) => void
}

/**
 * Las cuatro habilidades de la especie.
 *
 * Una tarjeta se apaga por dos motivos distintos y conviene que se noten
 * distintos: **no es tu turno** (todo el bloque en gris) o **no te alcanza la
 * energía** (solo esa tarjeta, con el costo marcado en rojo). El primero pasa
 * solo; el segundo lo puedes arreglar descansando.
 */
export default function SkillGrid({
  skills,
  energy,
  enabled,
  onUse,
  onPreview,
}: SkillGridProps) {
  return (
    <div className={styles.grid}>
      {skills.map((skill) => {
        const affordable = energy >= skill.energyCost
        const usable = enabled && affordable

        return (
          <button
            key={skill.id}
            type="button"
            className={`${styles.card} ${skill.isSignature ? styles.signature : ''} ${usable ? '' : styles.off}`}
            disabled={!usable}
            onClick={() => onUse(skill)}
            onPointerEnter={() => usable && onPreview(skill.energyCost)}
            onPointerLeave={() => onPreview(undefined)}
          >
            {skill.isSignature && (
              <span className={styles.badge}>
                <Label variant="purple" look="solid" size="xs" uppercase>
                  Signature
                </Label>
              </span>
            )}

            <span className={styles.head}>
              <span className={styles.name}>{skill.label}</span>
              <Label
                variant={affordable ? 'blue' : 'danger'}
                look="soft"
                size="xs"
              >
                {skill.energyCost} NRG
              </Label>
            </span>

            <span className={styles.effect}>{skill.effect}</span>
          </button>
        )
      })}
    </div>
  )
}
