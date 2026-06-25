import PageError from '@/shared/ui/Error/Error'
import AccGrid from '../../components/AccGrid'
import { useCollectionAccessoriesData } from '../../hooks/accessories/useCollectionAccessoriesData'
import { useCollectionAccessoriesUi } from '../../hooks/accessories/useCollectionAccessoriesUi'
import styles from '../../pages/CollectionPage.module.css'

export default function CollectionAccessoriesSection() {
  const ui = useCollectionAccessoriesUi()
  const { data, view, isLoading, error, reload } = useCollectionAccessoriesData(ui.slotFilter)

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

  if (!data) {
    return null
  }

  return (
    <AccGrid
      data={data}
      slotFilter={ui.slotFilter}
      onSetSlot={ui.setSlotFilter}
      owned={view.owned}
      total={view.total}
      pct={view.pct}
      visibleAccessories={view.visibleAccessories}
    />
  )
}
