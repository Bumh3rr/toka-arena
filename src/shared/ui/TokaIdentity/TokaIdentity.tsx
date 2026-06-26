import { IcPencil } from '@/shared/ui/Icons/Icons'
import { Card, IconButton, Label } from '@/shared/ui/Kit'
import RarityCard from '@/shared/ui/Cards/RarityCard/RarityCard'
import type { Rarity, Species } from '@/shared/domain/tokagotchi'
import styles from './TokaIdentity.module.css'
import { SPECIES_LABEL } from '@/shared/constants/tokagotchi'

interface TokaIdentityProps {
  name: string
  rarity: Rarity
  species: Species
  cp: number
  onRename?: () => void
}

export default function TokaIdentity({ name, rarity, species, cp, onRename }: TokaIdentityProps) {
  const label_specie = SPECIES_LABEL[species]
  return (
    <div className={styles.root}>
      {/* Nombre + renombrar */}
      <div className={styles.nameRow}>
        <span className={styles.name}>{name}</span>
        {onRename && ( <IconButton shape="sm" size={28} onClick={onRename} aria-label="Renombrar"> <IcPencil /></IconButton> )}
      </div>

      {/* Rareza · Especie · CP */}
      <div className={styles.metaRow}>
        <Card variant='gold' className={styles.cardCp}>
          <img src="/assets/ui/cp/cp_stars.png" alt="CP" className={styles.cpIcon} />
          <span className={styles.cpNum}>{cp}</span>
        </Card>
        <span className={styles.sep} aria-hidden="true" />
        <RarityCard rarity={rarity} />
        <span className={styles.sep} aria-hidden="true" />
        <Label variant='cream' className={styles.species}>{label_specie}</Label>
      </div>

    </div>
  )
}
