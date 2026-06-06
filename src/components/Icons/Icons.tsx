const INK = '#4A2800'

export function IcHeart({ c = '#46A8DC' }: { c?: string }) {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 20.3l-1.45-1.32C5.4 14.24 2 11.16 2 7.9 2 5.3 4 3.3 6.5 3.3c1.7 0 3.3.8 4.5 2.2 1.2-1.4 2.8-2.2 4.5-2.2C18 3.3 20 5.3 20 7.9c0 3.26-3.4 6.34-8.55 11.08L12 20.3z"
        fill={c} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

export function IcShield({ c = '#6FC04A' }: { c?: string }) {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 2.6l7 2.6v5.5c0 4.6-3 7.9-7 9.1-4-1.2-7-4.5-7-9.1V5.2l7-2.6z"
        fill={c} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M8.8 12.2l2.2 2.2 4.2-4.4" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IcBolt({ c = '#F08A4B' }: { c?: string }) {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M13.4 2.2L5 13.2h5.2l-1 8.6L18 9.4h-5.4l.8-7.2z"
        fill={c} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

export function IcCrown({ c = '#F6A937' }: { c?: string }) {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M3.4 17.6L2.2 7.7l5.2 3.9L12 4.6l4.6 7 5.2-3.9-1.2 9.9H3.4z"
        fill={c} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M3.4 17.6h17.2" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <circle cx="2.2" cy="7.7" r="1.7" fill={c} stroke={INK} strokeWidth="1.6" />
      <circle cx="21.8" cy="7.7" r="1.7" fill={c} stroke={INK} strokeWidth="1.6" />
      <circle cx="12" cy="4" r="1.9" fill={c} stroke={INK} strokeWidth="1.6" />
    </svg>
  )
}

export function IcLock() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="4.5" y="10.5" width="15" height="10.5" rx="3" fill="currentColor" />
      <path d="M7.5 10.5V7.8a4.5 4.5 0 0 1 9 0v2.7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="12" cy="15.4" r="1.8" fill="#fff" />
      <rect x="11.1" y="15.4" width="1.8" height="3.4" rx=".9" fill="#fff" />
    </svg>
  )
}

export function IcClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 7.4V12l3.2 2" />
    </svg>
  )
}

export function IcCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 12.5l5 5 10-11" />
    </svg>
  )
}

export function IcCopy() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8.5" y="8.5" width="11" height="11" rx="2.5" />
      <path d="M5.5 15.5H5a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 5 3.5h9A1.5 1.5 0 0 1 15.5 5v.5" />
    </svg>
  )
}

export function IcSparkle() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 2l1.7 6.1c.2.7.7 1.2 1.4 1.4L21 11l-5.9 1.5c-.7.2-1.2.7-1.4 1.4L12 20l-1.7-6.1c-.2-.7-.7-1.2-1.4-1.4L3 11l5.9-1.5c.7-.2 1.2-.7 1.4-1.4L12 2z"
        fill="currentColor" />
    </svg>
  )
}

export function IcMissions() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4.5" y="3.5" width="15" height="17" rx="2.6" />
      <path d="M8.5 3.5V2.6h7v.9" />
      <path d="M8.4 9h4M8.4 13h7M8.4 16.6h5" />
      <circle cx="6.2" cy="9" r=".2" />
    </svg>
  )
}

export function IcPencil() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20l1-4L15.5 5.5a2.1 2.1 0 0 1 3 3L8 19l-4 1z" />
      <path d="M13.5 7.5l3 3" />
    </svg>
  )
}

export function IcPerson() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8.6" r="3.8" fill="#FFF1D4" />
      <path d="M4.8 20c.6-3.8 3.6-5.6 7.2-5.6s6.6 1.8 7.2 5.6" fill="#FFF1D4" />
    </svg>
  )
}


export function IcSwap() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 8.5h12l-3-3M19.5 15.5h-12l3 3" />
    </svg>
  )
}

export function IcX() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function IcChevronDown() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.5 9l6.5 6.5L18.5 9" />
    </svg>
  )
}

export function IcStar() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 4l1.9 5.2 5.4 0-4.3 3.4 1.6 5.2L12 19.6l-4.6 3.2 1.6-5.2L4.7 14.2l5.4 0z"
        fill="#FFE08A" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

export function IcTrophy(){ return <svg viewBox="0 0 24 24" fill="none" stroke="#4A2800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4h10v4a5 5 0 0 1-10 0V4z"/><path d="M7 6H4.5v1.5A3 3 0 0 0 7 10.5M17 6h2.5v1.5A3 3 0 0 1 17 10.5M9.5 14.5h5M8.5 19.5h7M12 14.5v5"/></svg>; }
export function IcSkull(){ return <svg viewBox="0 0 24 24" fill="none" stroke="#4A2800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a8 8 0 0 0-5 14.2V20a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-2.8A8 8 0 0 0 12 3z"/><circle cx="9" cy="12" r="1.6" fill="#4A2800"/><circle cx="15" cy="12" r="1.6" fill="#4A2800"/><path d="M11 17h2"/></svg>; }
export function IcDice(){ return <svg viewBox="0 0 24 24" fill="none" stroke="#4A2800" strokeWidth="2" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r="1.3" fill="#4A2800"/><circle cx="15" cy="15" r="1.3" fill="#4A2800"/><circle cx="15" cy="9" r="1.3" fill="#4A2800"/><circle cx="9" cy="15" r="1.3" fill="#4A2800"/></svg>; }
export function IcMusic(){ return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V6l10-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></svg>; }
export function IcSpeaker(){ return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9.5h3l4-3.5v12l-4-3.5H4z"/><path d="M15 9a4 4 0 0 1 0 6M17.5 6.5a7 7 0 0 1 0 11"/></svg>; }
export function IcHelp(){ return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.3 9.3a2.8 2.8 0 0 1 5.4 1c0 1.8-2.7 2.2-2.7 4"/><circle cx="12" cy="17" r=".4"/></svg>; }
export function IcDoc(){ return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3.5h8L18.5 8v12.5A1 1 0 0 1 17.5 21h-11A1 1 0 0 1 5.5 20V4.5A1 1 0 0 1 6 3.5z"/><path d="M13.5 3.5V8h4.5M8.5 13h7M8.5 16.5h5"/></svg>; }
export function IcChevR(){ return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7"/></svg>; }
export function IcTerminal(){ return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M7 9l3 3-3 3M12.5 15h4"/></svg>; }
export function IcInfo(){ return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="7.6" r=".5"/></svg>; }

