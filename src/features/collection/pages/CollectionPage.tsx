import { useEffect } from 'react'
import { useCollection } from '../hooks/useCollection'
import { useNavBar } from '@/shared/hooks/useNavBar'
import ColTabs from '../components/ColTabs'
import DexIndicator from '../components/DexIndicator'
import FilterChips from '../components/FilterChips'
import TokaGrid from '../components/TokaGrid'
import AccGrid from '../components/AccGrid'
import DetailScreen from '../components/DetailScreen'
import styles from './CollectionPage.module.css'
import { IconButton } from '@/shared/ui/Kit'
import { IcSearch } from '@/shared/ui/Icons/Icons'

export default function CollectionPage() {
  const {
    state, ui,
    setTab, setFilter, toggleGroup,
    openDetail, closeDetail,
    toggleAbility,
    setAccSlot,
    activate, toggleFav,
    reload,
  } = useCollection()

  const { hideBar, showBar } = useNavBar()

  // Ocultar nav cuando se muestra el detalle
  useEffect(() => {
    if (ui.detailId) {
      hideBar()
    } else {
      showBar()
    }
    return () => showBar()
  }, [ui.detailId, hideBar, showBar])

  if (state.status === 'loading') {
    return (
      <div className={styles.screen}>
        <div className={styles.background} />
        <div className={styles.loading}>
          <span className={styles.loadingText}>Cargando colección…</span>
        </div>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className={styles.screen}>
        <div className={styles.background} />
        <div className={styles.errorWrap}>
          <p className={styles.errorMsg}>{state.error}</p>
          <button className={styles.retryBtn} onClick={reload}>Reintentar</button>
        </div>
      </div>
    )
  }

  const { data } = state

  return (
    <div className={styles.screen}>
      <div className={styles.background} />

      {/* Detail overlay */}
      {ui.detailId && (
        <DetailScreen
          tokaId={ui.detailId}
          data={data}
          expandedAbility={ui.expandedAbility}
          onBack={closeDetail}
          onToggleFav={toggleFav}
          onActivate={activate}
          onToggleAbility={toggleAbility}
        />
      )}

      {/* Main grid view */}
      <div className={styles.topbar}>
        <span className={styles.title}>Colección</span>
        <IconButton shape='sm' size={38} iconSize={19}  aria-label="Buscar"><IcSearch/></IconButton>
      </div>

      <ColTabs tab={ui.tab} onSetTab={setTab} />

      <div className={styles.scroll}>
        {ui.tab === 'toka' ? (
          <>
            <DexIndicator data={data} />
            <FilterChips
              filter={ui.filter}
              group={ui.group}
              onFilter={setFilter}
              onToggleGroup={toggleGroup}
            />
            <TokaGrid
              data={data}
              filter={ui.filter}
              group={ui.group}
              onSelect={openDetail}
            />
            <p className={styles.legend}>✓ Activo &nbsp; ★ Favorito &nbsp; ×N Duplicados &nbsp; 🔒 Falta</p>
          </>
        ) : (
          <AccGrid
            data={data}
            slotFilter={ui.accSlot}
            onSetSlot={setAccSlot}
          />
        )}
      </div>
    </div>
  )
}
