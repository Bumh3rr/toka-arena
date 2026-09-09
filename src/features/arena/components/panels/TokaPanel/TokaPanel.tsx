import SheetPanel from '@/shared/ui/Sheet/SheetPanel/SheetPanel'
import TokaIdentity from '@/shared/ui/Tokagotchi/TokaIdentity/TokaIdentity'
import StatsRow from '@/shared/ui/Tokagotchi/Row/StatsRow'
import { Button } from '@/shared/ui/Kit'
import { IcSwap } from '@/shared/ui/Icons/Icons'
import type { Tokagotchi } from '@/shared/domain/tokagotchi'
import styles from './TokaPanel.module.css'

interface TokaPanelProps {
  tokagotchi: Tokagotchi
  onChangeToka: () => void
}

/**
 * Ficha del luchador: identidad y stats con los que entra al combate.
 * Reutiliza los mismos bloques que el detalle de Home.
 */
export default function TokaPanel({ tokagotchi, onChangeToka }: TokaPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.identity}>
        <TokaIdentity
          name={tokagotchi.name}
          rarity={tokagotchi.rarity}
          species={tokagotchi.species}
          cp={tokagotchi.cp}
        />
        <Button variant="warm" size="md" icon={<IcSwap />} onClick={onChangeToka} />
      </div>

      <SheetPanel.Separator title="Estadísticas">
        <StatsRow stats={tokagotchi.stats} />
      </SheetPanel.Separator>
    </div>
  )
}
