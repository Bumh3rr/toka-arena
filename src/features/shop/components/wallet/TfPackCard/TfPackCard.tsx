import type { CSSProperties } from 'react'
import { Button, Label } from '@/shared/ui/Kit'
import { TF_PACK_ART, type TfPack, type TfPackFlair } from '../../../lib/walletPacks'
import { formatTF } from '../../../lib/formatTF'
import styles from './TfPackCard.module.css'

interface TfPackCardProps {
  pack: TfPack
  /** Posición en la lista — desfasa la flotación para que no floten al unísono. */
  index: number
  onBuy: (pack: TfPack) => void
}

/** Posiciones fijas de los destellos, en % del hueco de la ilustración. */
const SPARK_SPOTS = [
  { top: '4%', left: '2%', size: 13, delay: 0 },
  { top: '62%', left: '84%', size: 10, delay: 0.9 },
  { top: '26%', left: '90%', size: 8, delay: 1.7 },
  { top: '80%', left: '10%', size: 11, delay: 2.4 },
]

/**
 * Clase modificadora de la tarjeta por nivel.
 *
 * Va en su propio espacio de nombres (`flair*`) porque los valores de
 * `TfPackFlair` coinciden con los nombres de las clases de adorno
 * (.halo, .spark): usarlos tal cual se las aplicaba a la tarjeta entera.
 */
const FLAIR_CLASS: Record<TfPackFlair, string> = {
  plain: 'flairPlain',
  spark: 'flairSpark',
  halo: 'flairHalo',
  legend: 'flairLegend',
}

/** Cuántos destellos lleva cada nivel de adorno. */
const SPARK_COUNT: Record<TfPackFlair, number> = {
  plain: 0,
  spark: 2,
  halo: 2,
  legend: 4,
}

export default function TfPackCard({ pack, index, onBuy }: TfPackCardProps) {
  const sparks = SPARK_SPOTS.slice(0, SPARK_COUNT[pack.flair])
  const showHalo = pack.flair === 'halo' || pack.flair === 'legend'

  return (
    <div
      className={`${styles.pack} ${styles[FLAIR_CLASS[pack.flair]]} ${pack.popular ? styles.popular : ''}`}
      style={{ '--float-delay': `${index * -0.7}s` } as CSSProperties}
    >
      {pack.popular && <span className={styles.popBadge}>MÁS POPULAR</span>}

      {/*
       * La ilustración se lleva todo el peso visual: va suelta, a tamaño
       * grande, y crece con el paquete. El hueco tiene ancho fijo para que las
       * columnas sigan alineadas entre tarjetas con dibujos de distinto tamaño.
       */}
      <div className={styles.artSlot}>
        {pack.flair === 'legend' && <span className={styles.rays} aria-hidden="true" />}
        {showHalo && <span className={styles.halo} aria-hidden="true" />}

        <img
          src={TF_PACK_ART[pack.art]}
          alt=""
          aria-hidden="true"
          className={styles.art}
          style={{ '--art-size': `${pack.artSize}px` } as CSSProperties}
        />

        {sparks.map((s) => (
          <span
            key={`${s.top}-${s.left}`}
            className={styles.spark}
            aria-hidden="true"
            style={{
              top: s.top,
              left: s.left,
              '--spark-size': `${s.size}px`,
              '--spark-delay': `${s.delay}s`,
            } as CSSProperties}
          />
        ))}
      </div>

      <div className={styles.info}>
        <div className={styles.name}>{pack.name}</div>
        <div className={styles.tf}>{formatTF(pack.tf)} TF</div>
        {pack.bonus > 0 && (
          <Label size="xs" variant="green" look="soft" className={styles.bonus}>
            +{formatTF(pack.bonus)} TF bonus
          </Label>
        )}
      </div>

      <div className={styles.buy}>
        <div className={styles.mxn}>${pack.mxn} MXN</div>
        <Button variant="legend" size="sm" onClick={() => onBuy(pack)}>
          Comprar
        </Button>
      </div>
    </div>
  )
}
