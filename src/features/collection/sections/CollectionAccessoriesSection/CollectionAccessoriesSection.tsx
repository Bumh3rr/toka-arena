import PageError from '@/shared/ui/Error/Error'
import Probador from '../../components/Probador/Probador'
import { useCollectionAccessoriesData } from '../../hooks/accessories/useCollectionAccessoriesData'
import Loading from '@/shared/ui/Loading/Loading'

export default function CollectionAccessoriesSection() {
  const { roster, activeTokaId, isLoading, error, reload } = useCollectionAccessoriesData()

  if (isLoading) {
    return <Loading fullscreen text='Cargando colección...' /> 
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
