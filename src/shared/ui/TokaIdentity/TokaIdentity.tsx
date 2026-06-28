import { IcPaw, IcPencil } from '@/shared/ui/Icons/Icons'
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

function TokaIdentity({ name, rarity, species, cp, onRename }: TokaIdentityProps) {
  return (
    <div className={styles.root}>
      {/* Nombre + renombrar */}
      <div className={styles.nameRow}>
        <span className={styles.name}>{name}</span>
        {onRename && ( <IconButton shape="sm" size={28} onClick={onRename} aria-label="Renombrar"> <IcPencil /></IconButton> )}
      </div>

      {/* Rareza · Especie · CP */}
      <div className={styles.metaRow}>
        <RarityCard size='md' rarity={rarity} />
        <span className={styles.sep} aria-hidden="true" />
        <CardSpecies species={species} />
        <span className={styles.sep} aria-hidden="true" />
        <CardCp cp={cp} />
      </div>
    </div>
  )
}
function CardSpecies({ species }: { species: Species }) {
  const label_specie = SPECIES_LABEL[species]
  return (
    <Card variant='warm' className={styles.cardSpecies}>
      <IcPaw/>
      <Label look='ghost' size='md'  className={styles.species}>{label_specie}</Label>
    </Card>
  )
}

function CardCp({ cp }: { cp: number }) {
  return (
    <Card variant='gold' className={styles.cardCp}>
      <img src="/assets/ui/cp/cp_stars.png" alt="CP" className={styles.cpIcon} />
      <span className={styles.cpNum}>{cp} <span className={styles.cpLabel}>cp</span></span>
    </Card>
  )
}

export { TokaIdentity, CardSpecies, CardCp } 
