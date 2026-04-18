import { useState } from 'react'
import BattleCanvas from '../components/BattleCanvas'
import styles from './Arena.module.css'

const tokagotchiIzquierda = {
  username: 'manu4op',
  toka: 'mochi',
  vida: 100,
  animacion: 'idle',
  bucleAnimacion: 0,
  accesorioIndexCabeza: 0,
  accesorioIndexCuerpo: 1
}

const tokagotchiDerecha = {
  username: 'bumh3r',
  toka: 'hana',
  vida: 100,
  animacion: 'idle',
  bucleAnimacion: 0,
  accesorioIndexCabeza: 1,
  accesorioIndexCuerpo: 0
}

export default function Arena() {
  const [tokaIzquierda, setTokaIzquierda] = useState(tokagotchiIzquierda)
  const [tokaDerecha, setTokaDerecha] = useState(tokagotchiDerecha)

  let ancho = window.innerWidth
  if (ancho > 800) ancho = 412

  return (
    <div className={styles.arena}>

      {/* Ecenario de Batalla */}
      <div className={styles.containerBattle}>
        <div className={styles.background}>
          
          {/* Borra de vida user_1 */}
          <div className={styles.containerVida_1}>
            <div className={styles.containerLabels}>
              <div className={styles.username}>{tokaIzquierda.username}</div>
              <div className={styles.vida}>{`${tokaIzquierda.vida} HP`}</div>
            </div>

            <div className={styles.vidaBar}>
              <div className={styles.vidaFill} style={{ width: `${tokaIzquierda.vida}%` }} />
            </div>
          </div>

          {/* Borra de vida user_2 */}
          <div className={styles.containerVida_2}>
            <div className={styles.containerLabels}>
              <div className={styles.vida}>{`${tokaDerecha.vida} HP`}</div>
              <div className={styles.username}>{tokaDerecha.username}</div>
            </div>

            <div className={styles.vidaBar_2}>
              <div className={styles.vidaFill_2} style={{ width: `${tokaDerecha.vida}%` }} />
            </div>
          </div>

          <BattleCanvas
            className={styles.battleCanvas}
            width={ancho}
            height={200}
            izquierda={tokaIzquierda}
            derecha={tokaDerecha}
          />
        
        </div>
      </div>

      {/* Controles */}
      <div className={styles.controles}>
        <button className={styles.boton}
          onClick={() => {
            setTokaIzquierda(prev => ({ ...prev, animacion: 'ataque', bucleAnimacion: 1 }))
            setTokaDerecha(prev => ({ ...prev, animacion: 'daño', bucleAnimacion: 1 }))

            // Después de 3.4 segundos, volver a la animación idle
            setTimeout(() => {
              setTokaIzquierda(prev => ({ ...prev, animacion: 'idle', bucleAnimacion: 0 }))
              setTokaDerecha(prev => ({ ...prev, animacion: 'idle', bucleAnimacion: 0, vida: Math.max(prev.vida - 20, 0) }))
            }, 3400)
          }}
        >Atacar</button>

        <button className={styles.boton}
          onClick={() => {
            setTokaDerecha(prev => ({ ...prev, animacion: 'ataque', bucleAnimacion: 1 }))
            setTokaIzquierda(prev => ({ ...prev, animacion: 'daño', bucleAnimacion: 1 }))

            // Después de 3.4 segundos, volver a la animación idle
            setTimeout(() => {
              setTokaDerecha(prev => ({ ...prev, animacion: 'idle', bucleAnimacion: 0 }))
              setTokaIzquierda(prev => ({ ...prev, animacion: 'idle', bucleAnimacion: 0, vida: Math.max(prev.vida - 20, 0) }))
            }, 3400)
          }}
        >Recibir Ataque</button>
      </div>

    </div>
  )
}