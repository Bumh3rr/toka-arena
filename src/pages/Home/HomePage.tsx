import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TofuCanvas from '../../components/TofuCanvas/TofuCanvas'
import { MOCHI_MOCK } from '../../constants/tokagotchis'
import styles from './HomePage.module.css'

export default function HomePage() {
  const navigate = useNavigate()
  const tokagotchi = MOCHI_MOCK

  const [editingName, setEditingName] = useState(false)
  const [tokaName, setTokaName] = useState(tokagotchi.nombre)
  const [tempName, setTempName] = useState(tokagotchi.nombre)

  const handleSaveName = () => {
    setTokaName(tempName)
    setEditingName(false)
    // TODO: llamar API para guardar nombre
  }

  const handleCancelName = () => {
    setTempName(tokaName)
    setEditingName(false)
  }

  return (
    <div className={styles.container}>
      {/* Fondo */}
      <div className={styles.background} />

      {/* Header — usuario y TF */}
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <img
            src="/assets/ui/avatar_default.png"
            alt="Avatar"
            className={styles.avatar}
          />
          <span className={styles.username}>Emma</span>
        </div>
        <div className={styles.tfBadge}>
          <span className={styles.tfAmount}>10 TF</span>
        </div>
      </div>

      {/* Contenido scrolleable */}
      <div className={styles.scroll}>

        {/* Tokagotchi animado */}
        <div className={styles.tokaSection}>
          <TofuCanvas
            tokagotchi={tokagotchi}
            animacion="idle"
            width={200}
            height={200}
            scale={0.3}
          />

          {/* Nombre editable */}
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
                <button className={styles.btnSave} onClick={handleSaveName}>
                  Guardar
                </button>
                <button className={styles.btnCancel} onClick={handleCancelName}>
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.nameRow}>
              <span className={styles.tokaName}>{tokaName}</span>
              <button
                className={styles.editBtn}
                onClick={() => setEditingName(true)}
              >
                <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                  <path
                    d="M11 4H4C3.45 4 3 4.45 3 5V20C3 20.55 3.45 21 4 21H19C19.55 21 20 20.55 20 19V12"
                    stroke="#FFF8E7"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M18.5 2.5C19.33 1.67 20.67 1.67 21.5 2.5C22.33 3.33 22.33 4.67 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                    stroke="#FFF8E7"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <img src="/assets/ui/stat_card.png" alt="" className={styles.statBg} />
            <span className={styles.statValue} style={{ color: '#F97316' }}>
              {tokagotchi.stats.atk}
            </span>
            <span className={styles.statLabel}>Ataque</span>
          </div>
          <div className={styles.statCard}>
            <img src="/assets/ui/stat_card.png" alt="" className={styles.statBg} />
            <span className={styles.statValue} style={{ color: '#F5DFA0' }}>
              {tokagotchi.stats.def}
            </span>
            <span className={styles.statLabel}>Defensa</span>
          </div>
          <div className={styles.statCard}>
            <img src="/assets/ui/stat_card.png" alt="" className={styles.statBg} />
            <span className={styles.statValue} style={{ color: '#4FC3F7' }}>
              {tokagotchi.stats.hp}
            </span>
            <span className={styles.statLabel}>HP</span>
          </div>
        </div>

        {/* Rareza */}
        <div className={styles.rarezaRow}>
          <span
            className={styles.rarezaBadge}
            style={{ color: getRarezaColor(tokagotchi.rareza) }}
          >
            ★ {tokagotchi.rareza}
          </span>
          <span className={styles.especie}>
            {tokagotchi.especie.charAt(0).toUpperCase() + tokagotchi.especie.slice(1)}
          </span>
        </div>

        {/* Acciones de cuidado */}
        <div className={styles.accionesSection}>
          <h2 className={styles.sectionTitle}>Acciones</h2>
          <div className={styles.accionesRow}>
            <button className={styles.accionBtn}>
              <img src="/assets/ui/btn_alimentar.png" alt="Alimentar" className={styles.accionImg} />
              <span className={styles.accionReward}>+5 CP</span>
            </button>
            <button className={styles.accionBtn}>
              <img src="/assets/ui/btn_jugar.png" alt="Jugar" className={styles.accionImg} />
              <span className={styles.accionReward}>+8 CP</span>
            </button>
            <button className={styles.accionBtn}>
              <img src="/assets/ui/btn_bañar.png" alt="Bañar" className={styles.accionImg} />
              <span className={styles.accionReward}>+4 CP</span>
            </button>
          </div>
        </div>

        {/* CP total */}
        <div className={styles.cpCard}>
          <div className={styles.cpInfo}>
            <span className={styles.cpLabel}>Puntos de Crianza</span>
            <span className={styles.cpValue}>0 CP</span>
          </div>
          <div className={styles.cpBar}>
            <div className={styles.cpFill} style={{ width: '0%' }} />
          </div>
          <span className={styles.cpHint}>Necesitas 100 CP para ascender de rareza</span>
        </div>

        {/* Misiones del día */}
        <div className={styles.misionesSection}>
          <div className={styles.misionesHeader}>
            <h2 className={styles.sectionTitle}>Misiones del día</h2>
            <button
              className={styles.verTodasBtn}
              onClick={() => navigate('/misiones')}
            >
              VER TODAS
            </button>
          </div>

          {/* Misión preview */}
          <div className={styles.misionCard}>
            <div className={styles.misionInfo}>
              <span className={styles.misionNombre}>GANA UNA BATALLA PVP</span>
              <div className={styles.misionBar}>
                <div className={styles.misionFill} style={{ width: '0%' }} />
              </div>
            </div>
            <span className={styles.misionReward}>+10 TF</span>
          </div>
        </div>

        {/* Spacer para el nav */}
        <div style={{ height: 55 }} />
      </div>
    </div>
  )
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