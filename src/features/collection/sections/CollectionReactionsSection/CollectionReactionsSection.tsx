import { useCollectionReactionsData } from '../../hooks/reactions/useCollectionReactionsData'
import { useCollectionReactionsUi } from '../../hooks/reactions/useCollectionReactionsUi'
import styles from './CollectionReactionsSection.module.css'

export default function CollectionReactionsSection() {
  const ui = useCollectionReactionsUi()
  const { data, isLoading } = useCollectionReactionsData(ui.page)
  console.log('CollectionReactionsSection', { data, isLoading })
  return (
    <div className={styles.stub}>
      <h3 className={styles.title}>Reacciones</h3>
      <p className={styles.text}>
        Esta sección está en desarrollo y estará disponible en futuras actualizaciones.
      </p>
    </div>
  )
}
