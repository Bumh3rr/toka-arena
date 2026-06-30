import PageError from '@/shared/ui/Error/Error'
import Probador from '../../components/Probador/Probador'
import { useCollectionAccessoriesData } from '../../hooks/accessories/useCollectionAccessoriesData'
import styles from '../../pages/CollectionPage.module.css'

export default function CollectionAccessoriesSection() {
  const { roster, activeTokaId, isLoading, error, reload } = useCollectionAccessoriesData()

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <span className={styles.loadingText}>Cargando coleccion...</span>
      </div>
    )
  }

  if (error) {
    return <PageError message={error instanceof Error ? error.message : 'Error al cargar'} onRetry={reload} />
  }

  return (
    <Probador
      roster={roster}
      activeTokaId={activeTokaId}
      onEquipChange={async () => { await reload() }}
    />
  )
}
