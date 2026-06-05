import styles from './Card.module.css'

type ColorBackground = 'default' | 'gold' | 'silver' | 'bronze'

const colorBackgrounds: Record<ColorBackground, string> = {
    default: 'var(--gold)',
    gold: '#FFE7A6, var(--gold)',
    silver: 'var(--silver)',
    bronze: 'var(--bronze)',
}

const edgeColors: Record<ColorBackground, string> = {
    default: 'var(--gold-edge)',
    gold: 'var(--gold-edge)',
    silver: 'var(--silver-edge)',
    bronze: 'var(--bronze-edge)',
}

interface CardProps {
    children: React.ReactNode;
    colorBackground?: ColorBackground;
}

function Card({ children, colorBackground = 'default' }: CardProps) {
    return (
        <div
            className={styles.card}
            style={{
                background: `linear-gradient(180deg, ${colorBackgrounds[colorBackground]})`,
                boxShadow: `inset 0 2px 0 rgba(255, 255, 255, .6), 0 3px 0 ${edgeColors[colorBackground]}`,
            }}
        >
            {children}
        </div>
    )
}

function CardButton({ children, onClick, colorBackground = 'gold' }: { children: React.ReactNode; onClick: () => void; colorBackground?: ColorBackground }) {
    const className = `${styles.cardButton} 
    ${colorBackground === 'gold' ? styles.golden : ''} 
    ${colorBackground === 'silver' ? styles.silver : ''} 
    ${colorBackground === 'bronze' ? styles.bronze : ''}`
    
    return (
        <button
            onClick={onClick}
            className={className}
        >
            {children}
        </button>
    )
}

export { Card, CardButton }