import { IcPencil } from '@/shared/ui/Icons/Icons'
import { IconButton } from '@/shared/ui/Kit'
import CardRarity from '@/shared/ui/Tokagotchi/Cards/CardRarity/CardRarity'
import type { Rarity, Species } from '@/shared/domain/tokagotchi'
import styles from './TokaIdentity.module.css'
import CardCP from '../Cards/CardCP/CardCP'
import CardSpecies from '../Cards/CardSpecies/CardSpecies'

interface TokaIdentityProps {
  name: string
  rarity: Rarity
  species: Species
  cp: number
  onRename?: () => void
}

export default function TokaIdentity({ name, rarity, species, cp, onRename }: TokaIdentityProps) {
  return (
    <div className={styles.root}>
      {/* Nombre + renombrar */}
      <div className={styles.nameRow}>
        <span className={styles.name}>{name}</span>
        {onRename && ( <IconButton shape="sm" size={28} onClick={onRename} aria-label="Renombrar"> <IcPencil /></IconButton> )}
      </div>

      {/* Rareza · Especie · CP */}
      <div className={styles.metaRow}>
        <CardRarity size='md' rarity={rarity} />
        <span className={styles.sep} aria-hidden="true" />
        <CardSpecies species={species} />
        <span className={styles.sep} aria-hidden="true" />
        <CardCP value={cp} />
      </div>
    </div>
  )
}