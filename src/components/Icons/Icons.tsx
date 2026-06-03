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
    <svg viewBox="0 0 24 24" fill="none" stroke="#4A2800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20l1-4L15.5 5.5a2.1 2.1 0 0 1 3 3L8 19l-4 1z" />
      <path d="M13.5 7.5l3 3" />
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
