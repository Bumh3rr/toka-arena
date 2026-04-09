import { useBatalla } from '../../hooks/useBatalla'
import LobbyView from './views/LobbyView'
import PreparacionView from './views/PreparacionView'
import EsperaView from './views/EsperaView'
import BatallaView from './views/BatallaView'
import VictoriaView from './views/VictoriaView'
import DerrotaView from './views/DerrotaView'
import styles from './ArenaPage.module.css'

export default function ArenaPage() {
  const batalla = useBatalla()

  return (
    <div className={styles.container}>
      <div className={`${styles.background} ${batalla.fase === 'batalla' ? styles.backgroundPvp : ''}`} />
      {batalla.fase === 'lobby' && <LobbyView batalla={batalla} />}
      {batalla.fase === 'preparacion' && <PreparacionView batalla={batalla} />}
      {batalla.fase === 'espera' && <EsperaView batalla={batalla} />}
      {batalla.fase === 'batalla' && <BatallaView batalla={batalla} />}
      {batalla.fase === 'victoria' && <VictoriaView batalla={batalla} />}
      {batalla.fase === 'derrota' && <DerrotaView batalla={batalla} />}
    </div>
  )
}