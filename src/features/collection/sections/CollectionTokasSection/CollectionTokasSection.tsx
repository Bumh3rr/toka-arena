import { useEffect } from 'react'
import TokaDetailSheet from '../../components/TokaDetailSheet/TokaDetailSheet'
import FilterChips from '../../components/FilterChips'
import TokaGrid from '../../components/TokaGrid'
import PageError from '@/shared/ui/Error/Error'
import { useNavBar } from '@/shared/hooks/useNavBar'
import { useCollectionTokasUi } from '../../hooks/toka/useCollectionTokasUi'
import { useCollectionTokasData } from '../../hooks/toka/useCollectionTokasData'
import styles from '../../pages/CollectionPage.module.css'
import Loading from '@/shared/ui/Loading/Loading'
import { Toast } from '@/shared/ui/Kit'

export default function CollectionTokasSection() {
  const ui = useCollectionTokasUi()
  const { state, activate, setFavorite, ascend, rename, reload, toast } = useCollectionTokasData(ui.page, ui.filter)
  const { hideBar, showBar } = useNavBar()

  useEffect(() => {
    if (ui.detailGroupIds) hideBar()
    else showBar()
    return () => showBar()
  }, [ui.detailGroupIds, hideBar, showBar])

  if (state.status === 'error') {
    return <PageError message={state.error} onRetry={reload} />
  }

  const { data } = state.status === 'ready' ? state : { data: null }
  if (!data) {
    return <Loading fullscreen text='Cargando colección...' />
  }

  // Resolve fresh toka objects from roster using stored IDs
  const detailGroup = ui.detailGroupIds
    ? ui.detailGroupIds.flatMap(id => {
        const t = data.roster.find(t => t.id === id)
        return t ? [t] : []
      })
    : null

  return (
    <>
      {detailGroup && detailGroup.length > 0 && (
        <TokaDetailSheet
          tokagotchiGroup={detailGroup}
          activeTokaId={data.activeTokaId}
          serverTime={data.serverTime}
          tf={data.tf}
          onBack={ui.closeDetail}
          onToggleFav={setFavorite}
          onActivate={activate}
          onAscend={ascend}
          onRename={rename}
        />
      )}
      {toast && <Toast {...toast} />}

      <FilterChips
        filter={ui.filter}
        group={ui.group}
        onFilter={ui.setFilter}
        onToggleGroup={ui.toggleGroup}
      />

      <TokaGrid
        data={data.roster}
        filter={ui.filter}
        group={ui.group}
        tokagotchiIdActive={data.activeTokaId}
        onSelect={ui.openDetail}
      />

      <div className={styles.pagination}>
        <button
          className={styles.pageBtn}
          onClick={() => ui.setPage((prev) => Math.max(0, prev - 1))}
          disabled={!data.pagination.hasPrevious}
        >Anterior</button>
        <span className={styles.pageInfo}>
          Pagina {data.pagination.page + 1} de {Math.max(1, data.pagination.totalPages)}
        </span>
        <button
          className={styles.pageBtn}
          onClick={() => ui.setPage((prev) => prev + 1)}
          disabled={!data.pagination.hasNext}
        >
          Siguiente
        </button>
      </div>
    </>
  )
}
