import { useState } from 'react'
import BottomSheet from '@/shared/ui/Sheet/BottomSheet/BottomSheet'
import styles from './styles/RenameModal.module.css'
import { Button } from '@/shared/ui/Kit'

interface RenameModalProps {
  currentName: string
  onSave?: (name: string) => Promise<void>
  onClose: () => void
  sub?: string
  limit?: number
}

export default function RenameModal({ currentName, onSave = async () => {}, onClose, sub = '', limit = 14 }: RenameModalProps) {
  const [value, setValue] = useState(currentName)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    const name = (value.trim() || currentName).slice(0, limit)
    setSaving(true)
    if (onSave) await onSave(name)
    setSaving(false)
    onClose()
  }

  return (
    <BottomSheet title="Renombrar apodo" onClose={onClose}>
      <p className={styles.hint}>{sub}</p>
      <input
        className={styles.input}
        value={value}
        maxLength={limit}
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
