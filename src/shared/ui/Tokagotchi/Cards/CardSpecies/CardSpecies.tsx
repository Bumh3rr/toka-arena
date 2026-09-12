import { IcPaw } from '@/shared/ui/Icons/Icons'
import { Card, Label } from '@/shared/ui/Kit'
import styles from './CardSpecies.module.css'
import type { Species } from '@/shared/domain/tokagotchi'
import { SPECIES_LABEL } from '@/shared/constants/tokagotchi'

interface CardSpeciesProps {
    species: Species
}

export default function CardSpecies({ species }: CardSpeciesProps) {
    const label = SPECIES_LABEL[species]
    return (
        <Card variant='warm' className={styles.cardSpecies}>
            <IcPaw />
            <Label look='ghost' size='md' className={styles.labelSpecies}>{label}</Label>
        </Card>
    )
}
