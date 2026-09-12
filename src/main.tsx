import { createRoot } from 'react-dom/client'
import './index.css'
import App from '@/app/App'

type WindowWithVConsole = Window & {
    __TOKA_VCONSOLE__?: unknown
}

async function setupVConsole() {
    if (import.meta.env.VITE_ENABLE_VCONSOLE === 'false') return

    const win = window as WindowWithVConsole
    if (win.__TOKA_VCONSOLE__) return

    const { default: VConsole } = await import('vconsole')
    win.__TOKA_VCONSOLE__ = new VConsole()
}

void setupVConsole()

createRoot(document.getElementById('root')!).render(
    <App />
)
