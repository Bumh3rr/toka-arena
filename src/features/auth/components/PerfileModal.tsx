import React, { useState } from 'react'
import BottomSheet from '@/shared/ui/Sheet/BottomSheet/BottomSheet'
import { IcCheck, IcCopy, IcPencil, IcPerson, IcMusic, IcHelp, IcDoc, IcInfo, IcSpeaker, IcChevR } from '@/shared/ui/Icons/Icons'
import styles from './PerfileModal.module.css'
import { IconButton, Button, Toggle, Label, Toast } from '@/shared/ui/Kit'
import DevPanel from '@/shared/dev/component/DevPanel'
import { musicManager } from '@/shared/hooks/music/musicManager'
import { usePlayer } from '@/shared/player/hooks/usePlayer'
import PageError from '@/shared/ui/Error/Error'
import RenameModal from '@/shared/ui/modal/RenameModal'
import Loading from '@/shared/ui/Loading/Loading'
const IS_ENABLED_PANEL_DEV = import.meta.env.VITE_ENABLE_PANEL_DEV_TOOLS === 'true'

interface PerfileModalProps {
    onClose: () => void
}

export default function PerfileModal({ onClose }: PerfileModalProps) {
    const [copied, setCopied] = useState(false)
    const [renameOpen, setRenameOpen] = useState(false)
    const [musicOn, setMusicOn] = useState(() => !musicManager.muted)
    const { state, reload, renameUsername, toast } = usePlayer()
    const status = state.status

    if (status === 'loading') {
        return (
            <BottomSheet title="Perfil" sub={''} onClose={onClose}>
                <div className={styles.container}>
                    <Loading fullscreen text="Cargando perfil..." />
                </div>
            </BottomSheet>
        )
    }

    if (status === 'error') {
        return (
            <BottomSheet title="Perfil" sub={''} onClose={onClose}>
                <div className={styles.container}>
                    <PageError message={state.error} onRetry={reload} />
                </div>
                {IS_ENABLED_PANEL_DEV && <DevPanel />}
            </BottomSheet>
        )
    }

    const { data } = state
    const handleMusicToggle = (v: boolean) => {
        setMusicOn(v)
        musicManager.setMuted(!v)
    }

    const handleCopy = async () => {
        const id = data.mainTokagotchi?.id
        if (!id) return

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(id)
            } else {
                const textarea = document.createElement('textarea')
                textarea.value = id
                textarea.style.position = 'fixed'
                textarea.style.opacity = '0'
                document.body.appendChild(textarea)
                textarea.select()
                document.execCommand('copy')
                document.body.removeChild(textarea)
            }
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch (err) {
            console.error('Error al copiar:', err)
        }
    }

    return (
        <BottomSheet title="Perfil" sub={''} onClose={onClose}>
            <div className={styles.container}>
                <ProfileScene apodo={data.username} id={data.mainTokagotchi?.id || ''} onRename={() => setRenameOpen(true)} onCopy={handleCopy} copied={copied} />
            </div>
            <Settings music={musicOn} sfx={false} version={'1.0.0'} onMusic={handleMusicToggle} onSfx={() => { }} />
            {IS_ENABLED_PANEL_DEV && <DevPanel />}
            {renameOpen && (
                <RenameModal
                    currentName={data.username}
                    sub='Elige tu apodo de jugador. 20 caracteres máximo.'
                    limit={20}
                    onSave={renameUsername}
                    onClose={() => setRenameOpen(false)}
                />
            )}
            {toast && <Toast {...toast} />}
        </BottomSheet>
    )
}

// ── Profile scene ─────────────────────────────────────────────────────────────
function ProfileScene({ apodo, id, onRename, onCopy, copied }: { apodo: string, id: string, onRename: () => void, onCopy: () => void, copied: boolean }) {
    return (
        <div className={styles.scenePerfil}>
            <IconButton iconSize={60} variant="legend" size={100} shape="round" aria-label="Perfil">
                <IcPerson />
            </IconButton>
            <div className={styles.pfIdBlock}>
                <div className={styles.pfNickRow}>
                    <span className={styles.pfNick}>{apodo}</span>
                    <Button variant='cream' radius='sm' padding='5px 5px 5px 3px' onClick={onRename} aria-label="Renombrar" icon={<IcPencil />} />
                </div>
                <Button variant='warm' radius='lg' className={`${styles.pfIdpill} ${copied ? styles.copied : ''}`} onClick={onCopy}>
                    <span className={styles.pfIdlabel}>ID</span>
                    <span className={styles.pfIdval}>{id}</span>
                    <span className={styles.pfCopyic}>{copied ? <IcCheck /> : <IcCopy />}</span>
                </Button>
            </div>
        </div>
    )
}

// ── Settings ──────────────────────────────────────────────────────────────────
function SettingRow({ icon, label, children, onClick, last }: { icon: React.ReactNode, label: string, children?: React.ReactNode, onClick?: () => void, last?: boolean }) {
    const cls = `${styles.setRow} ${onClick ? styles.setRowClickable : ''} ${last ? styles.last : ''}`
    if (onClick) {
        return (
            <button className={cls} onClick={onClick}>
                <span className={styles.setIc}>{icon}</span>
                <span className={styles.setLabel}>{label}</span>
                <span className={styles.setEnd}>{children}</span>
            </button>
        )
    }
    return (
        <div className={cls}>
            <span className={styles.setIc}>{icon}</span>
            <span className={styles.setLabel}>{label}</span>
            <span className={styles.setEnd}>{children}</span>
        </div>
    )
}

function Settings({ music, sfx, version, onMusic, onSfx }: { music: boolean, sfx: boolean, version: string, onMusic: (v: boolean) => void, onSfx: (v: boolean) => void }) {
    return (
        <div className={styles.settings}>
            <div className={styles.secH}><span className={styles.t}>Ajustes</span><span className={styles.line}></span></div>
            <div className={styles.setCard}>
                <SettingRow icon={<IcMusic />} label="Música"><Toggle checked={music} onChange={onMusic} /></SettingRow>
                <SettingRow icon={<IcSpeaker />} label="Efectos de sonido"><Toggle disabled checked={sfx} onChange={onSfx} /></SettingRow>
                <SettingRow icon={<IcHelp />} label="Ayuda y soporte" onClick={() => { }}><IcChevR /></SettingRow>
                <SettingRow icon={<IcDoc />} label="Términos y condiciones" onClick={() => { }}><IcChevR /></SettingRow>
                <SettingRow icon={<IcInfo />} label="Versión" last><Label look='soft' variant='cream'>{version}</Label></SettingRow>
            </div>
        </div>
    )
}
