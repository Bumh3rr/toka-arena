import { useTienda } from '../../hooks/useTienda'
import type{ ItemTienda, PaqueteWallet } from '../../types/tienda'
import styles from './TiendaPage.module.css'

export default function TiendaPage() {
  const {
    tab, setTab, tf, items, paquetes,
    comprarItem, comprarPaquete,
    comprando, exitoId
  } = useTienda()

  return (
    <div className={styles.container}>
      <div className={styles.background} />

      <div className={styles.header}>
        <h1 className={styles.title}>Tienda</h1>
        <div className={styles.tfBadge}>
          <span className={styles.tfAmount}>{tf} TF</span>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'tf' ? styles.tabActive : ''}`}
          onClick={() => setTab('tf')}
        >TF</button>
        <button
          className={`${styles.tab} ${tab === 'wallet' ? styles.tabActive : ''}`}
          onClick={() => setTab('wallet')}
        >Wallet</button>
      </div>

      <div className={styles.scroll}>
        {tab === 'tf' ? (
          <TabTF
            items={items}
            tf={tf}
            onComprar={comprarItem}
            comprando={comprando}
            exitoId={exitoId}
          />
        ) : (
          <TabWallet paquetes={paquetes} onComprar={comprarPaquete} />
        )}
        <div style={{ height: 24 }} />
      </div>
    </div>
  )
}

// ── Pestaña TF ──
function TabTF({
  items,
  tf,
  onComprar,
  comprando,
  exitoId
}: {
  items: ItemTienda[]
  tf: number
  onComprar: (item: ItemTienda) => void
  comprando: string | null
  exitoId: string | null
}) {
  if (items.length === 0) {
    return (
      <div className={styles.tabContent}>
        <p className={styles.hint}>Compra accesorios con tus TF ganados</p>
        <div className={styles.emptyState}>
          <span className={styles.emptyText}>¡Ya tienes todos los accesorios!</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.tabContent}>
      <p className={styles.hint}>Compra accesorios con tus TF ganados</p>
      <div className={styles.itemGrid}>
        {items.map((item) => {
          const sinFondos = tf < item.precio
          const estaComprando = comprando === item.id
          const compraExitosa = exitoId === item.id

          return (
            <div
              key={item.id}
              className={`${styles.itemCard} ${compraExitosa ? styles.itemExito : ''} ${sinFondos ? styles.itemBloqueado : ''}`}
            >
              {/* Badge slot */}
              <span
                className={styles.itemSlot}
                style={{ background: item.slot === 'cabeza' ? '#F97316' : '#43A047' }}
              >
                {item.slot === 'cabeza' ? 'Cabeza' : 'Cuerpo'}
              </span>

              {/* Imagen */}
              <div className={`${styles.itemImgWrapper} ${compraExitosa ? styles.imgExito : ''}`}>
                <img src={item.imagen} alt={item.nombre} className={styles.itemImg} />
              </div>

              {/* Nombre */}
              <span className={styles.itemNombre}>{item.nombre}</span>

              {/* Botón */}
              <button
                className={`${styles.buyBtn} ${sinFondos ? styles.buyBtnDisabled : ''}`}
                onClick={() => !sinFondos && !estaComprando && onComprar(item)}
                disabled={sinFondos || estaComprando}
              >
                {estaComprando ? (
                  <span>...</span>
                ) : compraExitosa ? (
                  <span>¡Comprado!</span>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                      <circle cx="12" cy="12" r="10"
                        fill="#F5DFA0" stroke="#3D2B1F" strokeWidth="1.5" />
                      <text x="12" y="16" textAnchor="middle"
                        fontSize="10" fontWeight="bold" fill="#3D2B1F">TF</text>
                    </svg>
                    <span>{item.precio} TF</span>
                  </>
                )}
              </button>

              {/* Mensaje sin fondos */}
              {sinFondos && (
                <span className={styles.sinFondos}>TF insuficientes</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Pestaña Wallet ──
function TabWallet({
  paquetes,
  onComprar
}: {
  paquetes: PaqueteWallet[]
  onComprar: (paquete: PaqueteWallet) => void
}) {
  return (
    <div className={styles.tabContent}>
      <p className={styles.hint}>Recarga TF usando tu Toka Wallet</p>
      <div className={styles.paquetesList}>
        {paquetes.map((paquete) => (
          <div
            key={paquete.id}
            className={`${styles.paqueteCard} ${paquete.destacado ? styles.paqueteDestacado : ''}`}
          >
            {paquete.destacado && (
              <span className={styles.destacadoBadge}>MEJOR VALOR</span>
            )}

            {/* TF amount */}
            <div className={styles.paqueteLeft}>
              <span className={styles.paqueteTF}>{paquete.tf}</span>
              <span className={styles.paqueteTFLabel}>TF</span>
              {paquete.bonus && (
                <span
                  className={styles.paqueteBonus}
                  style={{ color: getRarezaColor(paquete.rarezaBonus ?? 'Común') }}
                >
                  + {paquete.bonus}
                </span>
              )}
            </div>

            {/* Precio y botón */}
            <div className={styles.paqueteRight}>
              <span className={styles.paquetePrecio}>${paquete.precio}</span>
              <span className={styles.paquetePorTF}>
                ${paquete.precioPorTF.toFixed(3)}/TF
              </span>
              <button
                className={styles.walletBtn}
                onClick={() => onComprar(paquete)}
              >
                Comprar
              </button>
            </div>
          </div>
        ))}
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