import { useNavigate } from 'react-router-dom'
import TokagotchiCanvas from '../../components/TofuCanvas/TofuCanvas'
import { useColeccion } from '../../hooks/useColeccion'
import type { Tokagotchi } from '../../types/toka'
import type { Accesorio } from '../../types/accesorios'
import styles from './ColeccionPage.module.css'

export default function ColeccionPage() {
  const navigate = useNavigate()
  const {
    tab, setTab,
    tokas, tokaActivo, setTokaActivo,
    accesorios,
    accesorioActivoCabeza,
    accesorioActivoCuerpo,
    equiparAccesorio,
    tokaConAccesorios
  } = useColeccion()

  return (
    <div className={styles.container}>
      <div className={styles.background} />

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Colección</h1>
      </div>

      {/* Pestañas */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'tokagotchi' ? styles.tabActive : ''}`}
          onClick={() => setTab('tokagotchi')}
        >
          Tokagotchi
        </button>
        <button
          className={`${styles.tab} ${tab === 'accesorios' ? styles.tabActive : ''}`}
          onClick={() => setTab('accesorios')}
        >
          Accesorios
        </button>
      </div>

      {/* Contenido */}
      <div className={styles.scroll}>
        {tab === 'tokagotchi' ? (
          <TabTokagotchi
            tokas={tokas}
            tokaActivo={tokaActivo}
            onSelect={setTokaActivo}
            onVerTienda={() => navigate('/tienda')}
          />
        ) : (
          <TabAccesorios
            tokaConAccesorios={tokaConAccesorios}
            accesorios={accesorios}
            accesorioActivoCabeza={accesorioActivoCabeza}
            accesorioActivoCuerpo={accesorioActivoCuerpo}
            onEquipar={equiparAccesorio}
          />
        )}
        <div style={{ height: 24 }} />
      </div>
    </div>
  )
}

// ── Pestaña Tokagotchi ──
function TabTokagotchi({
  tokas,
  tokaActivo,
  onSelect,
  onVerTienda
}: {
  tokas: Tokagotchi[]
  tokaActivo: Tokagotchi
  onSelect: (t: Tokagotchi) => void
  onVerTienda: () => void
}) {
  const MAX_SLOTS = 3

  return (
    <div className={styles.tabContent}>
      {/* Info resumen */}
      <div className={styles.resumenRow}>
        <div className={styles.resumenCard}>
          <span className={styles.resumenLabel}>TOKAGOTCHIS</span>
          <span className={styles.resumenValue}>{tokas.length}</span>
        </div>
        <div className={styles.resumenCard}>
          <span className={styles.resumenLabel}>ACTIVO</span>
          <span className={styles.resumenValueOrange}>{tokaActivo.nombre}</span>
        </div>
      </div>

      {/* Grid de tokas */}
      <div className={styles.tokaGrid}>
        {tokas.map((toka) => (
          <TokaCard
            key={toka.id}
            toka={toka}
            activo={toka.id === tokaActivo.id}
            onSelect={() => onSelect(toka)}
          />
        ))}

        {/* Slots bloqueados */}
        {Array.from({ length: MAX_SLOTS - tokas.length }).map((_, i) => (
          <div key={`locked_${i}`} className={styles.lockedCard}>
            <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
              <rect x="3" y="11" width="18" height="11" rx="2"
                fill="none" stroke="#8C6B4A" strokeWidth="2" />
              <path d="M7 11V7C7 4.79 8.79 3 11 3H13C15.21 3 17 4.79 17 7V11"
                stroke="#8C6B4A" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className={styles.lockedText}>No desbloqueado</span>
            <button className={styles.verTiendaBtn} onClick={onVerTienda}>
              Ver Tienda
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function TokaCard({
  toka,
  activo,
  onSelect
}: {
  toka: Tokagotchi
  activo: boolean
  onSelect: () => void
}) {
  return (
    <div
      className={`${styles.tokaCard} ${activo ? styles.tokaCardActivo : ''}`}
      onClick={onSelect}
    >
      {activo && <span className={styles.activoBadge}>Activo</span>}
      <div
        className={styles.rarezaDot}
        style={{ background: getRarezaColor(toka.rareza) }}
      />
      <div className={styles.itemImgWrapper}>
        <img
          src={`/assets/tokagotchis/${toka.especie}.png`}
          alt={toka.id}
          className={styles.itemImg}
        />
      </div>
      <span className={styles.tokaCardNombre}>{toka.nombre}</span>
      <span className={styles.tokaCardEspecie}>
        {toka.especie.charAt(0).toUpperCase() + toka.especie.slice(1)}
      </span>
      <div className={styles.statsRow}>
        <span className={styles.statAtk}>ATK {toka.stats.atk}</span>
        <span className={styles.statDef}>DEF {toka.stats.def}</span>
        <span className={styles.statHp}>HP {toka.stats.hp}</span>
      </div>
    </div>
  )
}

// ── Pestaña Accesorios ──
function TabAccesorios({
  tokaConAccesorios,
  accesorios,
  accesorioActivoCabeza,
  accesorioActivoCuerpo,
  onEquipar
}: {
  tokaConAccesorios: Tokagotchi
  accesorios: Accesorio[]
  accesorioActivoCabeza: Accesorio | null
  accesorioActivoCuerpo: Accesorio | null
  onEquipar: (acc: Accesorio) => void
}) {
  return (
    <div className={styles.tabContent}>
      {/* Preview toka con accesorios */}
      <div className={styles.previewCard}>
        <div className={styles.previewLeft}>
          <TokagotchiCanvas
            tokagotchi={tokaConAccesorios}
            animacion="idle"
            width={80}
            height={80}
            scale={0.13 }
          />
        </div>
        <div className={styles.previewRight}>
          <span className={styles.previewNombre}>
            {tokaConAccesorios.nombre.toUpperCase()} EQUIPADO
          </span>
          <div className={styles.equipadoSlot}>
            <div
              className={styles.slotDot}
              style={{ background: accesorioActivoCabeza ? '#3D99FF' : '#A0A0A0' }}
            />
            <span className={styles.slotNombre}>
              {accesorioActivoCabeza ? accesorioActivoCabeza.nombre : 'Cabeza vacía'}
            </span>
          </div>
          <div className={styles.equipadoSlot}>
            <div
              className={styles.slotDot}
              style={{ background: accesorioActivoCuerpo ? '#43A047' : '#A0A0A0' }}
            />
            <span className={styles.slotNombre}>
              {accesorioActivoCuerpo ? accesorioActivoCuerpo.nombre : 'Cuerpo vacío'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid de accesorios */}
      <div className={styles.accesorioGrid}>
        {accesorios.map((acc) => {
          const equipado =
            accesorioActivoCabeza?.id === acc.id ||
            accesorioActivoCuerpo?.id === acc.id

          return acc.desbloqueado ? (
            <div
              key={acc.id}
              className={`${styles.accesorioCard} ${equipado ? styles.accesorioEquipado : ''}`}
              onClick={() => onEquipar(acc)}
            >
              {equipado && (
                <div className={styles.equipadoDot} />
              )}
              <img
                src={acc.imagen}
                alt={acc.nombre}
                className={styles.accesorioImg}
              />
              <span className={styles.accesorioNombre}>{acc.nombre}</span>
              <span
                className={styles.accesorioSlotBadge}
                style={{ background: acc.slot === 'cabeza' ? '#F97316' : '#43A047' }}
              >
                {acc.slot === 'cabeza' ? 'Cabeza' : 'Cuerpo'}
              </span>
              <span
                className={styles.accesorioRareza}
                style={{ color: getRarezaColor(acc.rareza) }}
              >
                {acc.rareza}
              </span>
            </div>
          ) : (
            <div
              key={acc.id}
              className={`${styles.lockedCard}`}
            >
              <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
                <rect x="3" y="11" width="18" height="11" rx="2"
                  fill="none" stroke="#8C6B4A" strokeWidth="2" />
                <path d="M7 11V7C7 4.79 8.79 3 11 3H13C15.21 3 17 4.79 17 7V11"
                  stroke="#8C6B4A" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className={styles.accesorioNombre}>{acc.nombre}</span>
              <span
                className={styles.accesorioSlotBadge}
                style={{ background: acc.slot === 'cabeza' ? '#F97316' : '#43A047' }}
              >
                {acc.slot === 'cabeza' ? 'Cabeza' : 'Cuerpo'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function getRarezaColor(rareza: string): string {
  const colores: Record<string, string> = {
    'Común': '#A0A0A0',
    'Raro': '#3D99FF',
    'Legendario': '#FF8000'
  }
  return colores[rareza] ?? '#A0A0A0'
}