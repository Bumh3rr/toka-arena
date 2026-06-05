import { useState } from 'react'
import BottomSheet from '../BottomSheet/BottomSheet'
import styles from './RenameModal.module.css'
import { Button } from '../UIKit'

interface RenameModalProps {
  currentName: string
  onSave: (name: string) => Promise<void>
  onClose: () => void
}

export default function RenameModal({ currentName, onSave, onClose }: RenameModalProps) {
  const [value, setValue] = useState(currentName)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    const name = (value.trim() || currentName).slice(0, 14)
    setSaving(true)
    await onSave(name)
    setSaving(false)
    onClose()
  }

  return (
    <BottomSheet title="Renombrar apodo" onClose={onClose}>
      <p className={styles.hint}>Elige un apodo para tu Tokagotchi activo.</p>
      <input
        className={styles.input}
        value={value}
        maxLength={14}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSave()}
      />
      <div className={styles.actions}>
        <Button variant="cream" size="md" onClick={onClose}>Cancelar</Button>
        <Button variant="gold" size="md" onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </Button> 
      </div>
    </BottomSheet>
  )
}
