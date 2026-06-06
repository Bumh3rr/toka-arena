import React, { useState } from 'react'
import BottomSheet from '../BottomSheet/BottomSheet'
import { IcCheck, IcCopy, IcPencil, IcPerson, IcMusic, IcHelp, IcDoc, IcInfo, IcSpeaker, IcChevR } from '../Icons/Icons'
import styles from './PerfileModal.module.css'
import { IconButton, Button, Toggle } from '../UIKit'
const IS_DEV = import.meta.env.DEV

interface PerfileModalProps {
    onClose: () => void
}

export default function PerfileModal({ onClose }: PerfileModalProps) {

    const [copied, setCopied] = useState(false)
    const [musicOn, setMusicOn] = useState(true)

    const handleCopy = () => {
        navigator.clipboard.writeText('TKA-123456789')
        setCopied(true)
        setTimeout(() => setCopied(false), 300)
    }

    return (
        <BottomSheet title="Perfil" sub={''} onClose={onClose}>
            <div className={styles.container}>
                <ProfileScene apodo="JohnDoe" id="TKA-123456789" onRename={() => { }} onCopy={handleCopy} copied={copied} />
            </div>
            <Settings music={musicOn} sfx={false} version={'1.0.0'} onMusic={setMusicOn} onSfx={() => { }} />
            {IS_DEV && <Dev />}
        </BottomSheet>
    )
}

function Dev() {
    return (
        <div className={styles.settings}>
            <div className={styles.secH}><span className={styles.t}>Dev Tools</span><span className={styles.line}></span></div>
        </div>);
}

function ProfileScene({ apodo, id, onRename, onCopy, copied }: { apodo: string, id: string, onRename: () => void, onCopy: () => void, copied: boolean }) {
    return (
        <div className={styles.scenePerfil}>
            <IconButton iconSize={60} variant="legend" size={100} shape="round" aria-label="Perfil">
                <IcPerson />
            </IconButton>
            <div className={styles.pfIdBlock}>
                <div className={styles.pfNickRow}>
                    <span className={styles.pfNick}>{apodo}</span>
                    <Button disabled variant='cream' radius='sm' padding='5px 5px 5px 3px' onClick={onRename} aria-label="Renombrar" icon={<IcPencil />} />
                </div>
                <Button variant='warm' radius='lg' className={`${styles.pfIdpill} ${copied ? styles.copied : ''}`} onClick={onCopy}>
                    <span className={styles.pfIdlabel}>ID</span>
                    <span className={styles.pfIdval}>{id}</span>
                    <span className={styles.pfCopyic}>{copied ? <IcCheck /> : <IcCopy />}</span>
                </Button>
            </div>
        </div>);
}

function SettingRow({ icon, label, children, onClick, last }: { icon: React.ReactNode, label: string, children?: React.ReactNode, onClick?: () => void, last?: boolean }) {
    const cls = `${styles.setRow} ${onClick ? styles.setRowClickable : ''} ${last ? styles.last : ''}`
    if (onClick) {
        return (
            <button className={cls} onClick={onClick}>
                <span className={styles.setIc}>{icon}</span>
                <span className={styles.setLabel}>{label}</span>
                <span className={styles.setEnd}>{children}</span>
            </button>)
    }
    return (
        <div className={cls}>
            <span className={styles.setIc}>{icon}</span>
            <span className={styles.setLabel}>{label}</span>
            <span className={styles.setEnd}>{children}</span>
        </div>);
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
                <SettingRow icon={<IcInfo />} label="Versión" last><span className={styles.setVer}>{version}</span></SettingRow>
            </div>
        </div>);
}