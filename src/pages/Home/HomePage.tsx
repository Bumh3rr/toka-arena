import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TofuCanvas from '../../components/TofuCanvas/TofuCanvas'
import { useHome } from '../../hooks/useHome'
import type { TokagotchiAnimacion } from '../../types/toka'
import styles from './HomePage.module.css'

export default function HomePage() {
  const navigate = useNavigate()
  const {
    tokagotchi, username, tf, misiones, loading,
    renameToka, ejecutarAccion, accionando, accionExito, errorAccion
  } = useHome()

  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState('')

  const handleEditStart = () => {
    setTempName(tokagotchi?.nombre ?? '')
    setEditingName(true)
  }

  const handleSaveName = async () => {
    if (tempName.trim()) await renameToka(tempName.trim())
    setEditingName(false)
  }

  const handleCancelName = () => setEditingName(false)

  if (loading || !tokagotchi) {
    return (
      <div className={styles.container}>
        <div className={styles.background} />
        <div className={styles.loading}>
          <span className={styles.loadingText}>Cargando...</span>
        </div>
      </div>
    )
  }


  // Solo primera misión para el preview
  const primerasMisiones = misiones.slice(0, 2)
  const animacionToka = getAnimacionHome(accionando ?? accionExito)

  return (
    <div className={styles.container}>
      <div className={styles.background} />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <img src="/assets/ui/avatar_default.png" alt="Avatar" className={styles.avatar} />
          <span className={styles.username}>{username}</span>
        </div>
        <div className={styles.tfBadge}>
          <span className={styles.tfAmount}>{tf} TF</span>
        </div>
      </div>

      <div className={styles.scroll}>

        {/* Tokagotchi */}
        <div className={styles.tokaSection}>
          <TofuCanvas
            tokagotchi={tokagotchi}
            animacion={animacionToka}
            width={200}
            height={200}
            scale={0.3}
          />

          {editingName ? (
            <div className={styles.nameEdit}>
              <input
                className={styles.nameInput}
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                maxLength={12}
                autoFocus
              />
              <div className={styles.nameEditBtns}>
                <button className={styles.btnSave} onClick={handleSaveName}>Guardar</button>
                <button className={styles.btnCancel} onClick={handleCancelName}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div className={styles.nameRow}>
              <span className={styles.tokaName}>{tokagotchi.nombre}</span>
              <button className={styles.editBtn} onClick={handleEditStart}>
                <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                  <path d="M11 4H4C3.45 4 3 4.45 3 5V20C3 20.55 3.45 21 4 21H19C19.55 21 20 20.55 20 19V12"
                    stroke="#FFF8E7" strokeWidth="2" strokeLinecap="round" />
                  <path d="M18.5 2.5C19.33 1.67 20.67 1.67 21.5 2.5C22.33 3.33 22.33 4.67 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                    stroke="#FFF8E7" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <img src="/assets/ui/stat_card.png" alt="" className={styles.statBg} />
            <span className={styles.statValue} style={{ color: '#7c2d12' }}>{tokagotchi.stats.atk}</span>
            <span className={styles.statLabel}>Ataque</span>
          </div>
          <div className={styles.statCard}>
            <img src="/assets/ui/stat_card.png" alt="" className={styles.statBg} />
            <span className={styles.statValue} style={{ color: '#F5DFA0' }}>{tokagotchi.stats.def}</span>
            <span className={styles.statLabel}>Defensa</span>
          </div>
          <div className={styles.statCard}>
            <img src="/assets/ui/stat_card.png" alt="" className={styles.statBg} />
            <span className={styles.statValue} style={{ color: '#4FC3F7' }}>{tokagotchi.stats.hp}</span>
            <span className={styles.statLabel}>HP</span>
          </div>
        </div>

        {/* Rareza */}
        <div className={styles.rarezaRow}>
          <span className={styles.rarezaBadge} style={{ color: getRarezaColor(tokagotchi.rareza) }}>
            ★ {tokagotchi.rareza}
          </span>
          <span className={styles.especie}>
            {tokagotchi.especie.charAt(0).toUpperCase() + tokagotchi.especie.slice(1)}
          </span>
        </div>

        {/* Acciones */}
        <div className={styles.accionesSection}>
          <h2 className={styles.sectionTitle}>Acciones</h2>
          <div className={styles.accionesRow}>

            <button
              className={`${styles.accionBtn} ${accionExito === 'feed' ? styles.accionExito : ''} ${accionando === 'feed' ? styles.accionando : ''}`}
              onClick={() => ejecutarAccion('feed')}
              disabled={!!accionando}
            >
              <img src="/assets/ui/btn_alimentar.png" alt="Alimentar" className={styles.accionImg} />
              <span className={styles.accionReward}>
                {accionExito === 'feed' ? '¡+5 CP!' : '+5 CP'}
              </span>
            </button>

            <button
              className={`${styles.accionBtn} ${accionExito === 'play' ? styles.accionExito : ''} ${accionando === 'play' ? styles.accionando : ''}`}
              onClick={() => ejecutarAccion('play')}
              disabled={!!accionando}
            >
              <img src="/assets/ui/btn_jugar.png" alt="Jugar" className={styles.accionImg} />
              <span className={styles.accionReward}>
                {accionExito === 'play' ? '¡+8 CP!' : '+8 CP'}
              </span>
            </button>

            <button
              className={`${styles.accionBtn} ${accionExito === 'bathe' ? styles.accionExito : ''} ${accionando === 'bathe' ? styles.accionando : ''}`}
              onClick={() => ejecutarAccion('bathe')}
              disabled={!!accionando}
            >
              <img src="/assets/ui/btn_bañar.png" alt="Bañar" className={styles.accionImg} />
              <span className={styles.accionReward}>
                {accionExito === 'bathe' ? '¡+4 CP!' : '+4 CP'}
              </span>
            </button>

          </div>

          {/* Error de cooldown */}
          {errorAccion && (
            <p className={styles.errorAccion}>{errorAccion}</p>
          )}
        </div>

        {/* Misiones preview */}
        <div className={styles.misionesSection}>
          <div className={styles.misionesHeader}>
            <h2 className={styles.sectionTitle}>Misiones del día</h2>
            <button className={styles.verTodasBtn} onClick={() => navigate('/misiones')}>
              VER TODAS
            </button>
          </div>
          {primerasMisiones.map((m) => (
            <div key={m.id} className={styles.misionCard}>
              <div className={styles.misionInfo}>
                <span className={styles.misionNombre}>{m.description}</span>
                <div className={styles.misionBar}>
                  <div className={styles.misionFill} style={{ width: `${m.percentage}%` }} />
                </div>
              </div>
              <span className={styles.misionReward}>+{m.rewardTf} TF</span>
            </div>
          ))}
        </div>

        <div style={{ height: 55 }} />
      </div>
    </div>
  )
}

function getAnimacionHome(accion: 'feed' | 'play' | 'bathe' | null): TokagotchiAnimacion {
  if (accion === 'feed') return 'feed'
  if (accion === 'play') return 'play'
  if (accion === 'bathe') return 'bath'
  return 'idle'
}

function getRarezaColor(rareza: string): string {
  const colores: Record<string, string> = {
    'Común': '#ffffff',
    'Raro': '#3D99FF',
    'Épico': '#A335EE',
    'Legendario': '#FF8000'
  }
  return colores[rareza] ?? '#ffffff'
}