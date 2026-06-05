import { Button, Card, Label, IconButton } from '../../components/UIKit'
import type { ColorVariant } from '../../components/UIKit'
import { IcCrown, IcLock, IcPencil, IcHeart, IcBolt, IcShield } from '../../components/Icons/Icons'
import styles from './UIKitPage.module.css'

const VARIANTS: ColorVariant[] = ['legend', 'gold', 'warm', 'green', 'blue', 'purple', 'cream', 'danger']

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <span className={styles.sectionTitle}>{title}</span>
        <span className={styles.sectionLine} />
      </div>
      {children}
    </section>
  )
}

function Row({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className={styles.row}>
      {label && <span className={styles.rowLabel}>{label}</span>}
      <div className={styles.rowItems}>{children}</div>
    </div>
  )
}

export default function UIKitPage() {
  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <span className={styles.pageTitle}>UI Kit</span>
        <Label variant="purple" look="soft" size="xs" uppercase>dev only</Label>
      </div>

      <div className={styles.scroll}>

        {/* ── BUTTON ── */}
        <Section title="Button — variantes">
          <Row label="sizes">
            <Button variant="legend" size="sm">Small</Button>
            <Button variant="legend" size="md">Medium</Button>
            <Button variant="legend" size="lg">Large</Button>
          </Row>
          <Row label="radius">
            <Button variant="gold" size="sm" radius="sm">r:sm</Button>
            <Button variant="gold" size="sm" radius="md">r:md</Button>
            <Button variant="gold" size="sm" radius="lg">r:lg</Button>
            <Button variant="gold" size="sm" radius="pill">r:pill</Button>
          </Row>
          <Row label="colors">
            {VARIANTS.map(v => (
              <Button key={v} variant={v} size="sm">{v}</Button>
            ))}
          </Row>
          <Row label="con ícono">
            <Button variant="green" size="md" icon={<IcBolt />}>Atacar</Button>
            <Button variant="legend" size="md" iconRight={<IcCrown />}>Ascender</Button>
            <Button variant="cream" size="md" icon={<IcLock />}>Bloqueado</Button>
          </Row>
          <Row label="full width">
            <Button variant="green" size="lg" fullWidth icon={<IcHeart />}>
              Usar poción
            </Button>
          </Row>
          <Row label="disabled">
            <Button variant="legend" size="md" disabled>Deshabilitado</Button>
            <Button variant="green"  size="md" disabled>Deshabilitado</Button>
          </Row>
          <Row label="overrides">
            <Button variant="blue" size="md" fontSize={10} padding="4px 10px">
              fs 10 / pad custom
            </Button>
            <Button variant="purple" size="md" color="#FFD15A">
              color override
            </Button>
          </Row>
        </Section>

        {/* ── CARD ── */}
        <Section title="Card — variantes">
          <Row label="colores">
            {(['cream', 'warm', 'gold', 'legend', 'green', 'blue'] as ColorVariant[]).map(v => (
              <Card key={v} variant={v} padding="sm" style={{ minWidth: 64, textAlign: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink)' }}>{v}</span>
              </Card>
            ))}
          </Row>
          <Row label="padding">
            {(['none', 'sm', 'md', 'lg'] as const).map(p => (
              <Card key={p} variant="warm" padding={p} style={{ minWidth: 54, textAlign: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-2)' }}>{p}</span>
              </Card>
            ))}
          </Row>
          <Row label="radio">
            {(['sm', 'md', 'lg'] as const).map(r => (
              <Card key={r} variant="cream" padding="sm" radius={r} style={{ minWidth: 54, textAlign: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-2)' }}>{r}</span>
              </Card>
            ))}
          </Row>
          <Row label="shadow">
            {(['none', 'sm', 'md'] as const).map(s => (
              <Card key={s} variant="cream" padding="sm" shadow={s} style={{ minWidth: 64, textAlign: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-2)' }}>{s}</span>
              </Card>
            ))}
          </Row>
          <Row label="sin borde">
            <Card variant="gold" padding="sm" border={false} style={{ minWidth: 80, textAlign: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-2)' }}>border: false</span>
            </Card>
          </Row>
        </Section>

        {/* ── LABEL ── */}
        <Section title="Label — variantes">
          <Row label="solid">
            {VARIANTS.map(v => (
              <Label key={v} variant={v} look="solid" size="sm">{v}</Label>
            ))}
          </Row>
          <Row label="soft">
            {VARIANTS.map(v => (
              <Label key={v} variant={v} look="soft" size="sm">{v}</Label>
            ))}
          </Row>
          <Row label="outline">
            {VARIANTS.map(v => (
              <Label key={v} variant={v} look="outline" size="sm">{v}</Label>
            ))}
          </Row>
          <Row label="ghost">
            {VARIANTS.map(v => (
              <Label key={v} variant={v} look="ghost" size="sm">{v}</Label>
            ))}
          </Row>
          <Row label="sizes">
            <Label variant="legend" look="solid" size="xs">xs label</Label>
            <Label variant="legend" look="solid" size="sm">sm label</Label>
            <Label variant="legend" look="solid" size="md">md label</Label>
          </Row>
          <Row label="uppercase + dot">
            <Label variant="green"  look="soft" size="sm" uppercase dot>Completado</Label>
            <Label variant="danger" look="soft" size="sm" uppercase dot>Fallido</Label>
            <Label variant="gold"   look="soft" size="sm" uppercase dot>Pendiente</Label>
          </Row>
        </Section>

        {/* ── ICON BUTTON ── */}
        <Section title="IconButton — variantes">
          <Row label="round">
            {VARIANTS.map(v => (
              <IconButton key={v} variant={v} size={36} shape="round" ariaLabel={v}>
                <IcPencil />
              </IconButton>
            ))}
          </Row>
          <Row label="shapes">
            <IconButton variant="legend" size={36} shape="round"><IcCrown /></IconButton>
            <IconButton variant="gold"   size={36} shape="sm"><IcBolt /></IconButton>
            <IconButton variant="green"  size={36} shape="md"><IcShield /></IconButton>
            <IconButton variant="blue"   size={36} shape="lg"><IcHeart /></IconButton>
          </Row>
          <Row label="sizes">
            <IconButton variant="cream" size={24} shape="round"><IcPencil /></IconButton>
            <IconButton variant="cream" size={32} shape="round"><IcPencil /></IconButton>
            <IconButton variant="cream" size={42} shape="round"><IcPencil /></IconButton>
            <IconButton variant="cream" size={54} shape="round"><IcPencil /></IconButton>
          </Row>
          <Row label="disabled">
            <IconButton variant="legend" size={36} shape="round" disabled><IcCrown /></IconButton>
            <IconButton variant="green"  size={36} shape="md"    disabled><IcBolt /></IconButton>
          </Row>
        </Section>

        {/* ── COMBINACIONES ── */}
        <Section title="Combinaciones">
          <Row>
            <Card variant="cream" padding="md" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <Label variant="purple" look="solid" size="xs" uppercase>Épico</Label>
                <span style={{ fontFamily: 'var(--font-title)', fontSize: 15, fontWeight: 700, color: 'var(--ink)', flex: 1 }}>
                  Nombre del item
                </span>
                <IconButton variant="cream" size={28} shape="round"><IcPencil /></IconButton>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <Button variant="green" size="sm" fullWidth>Activar</Button>
                <Button variant="danger" size="sm">Soltar</Button>
              </div>
            </Card>
          </Row>
          <Row>
            <Card variant="legend" padding="md" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Label variant="cream" look="solid" size="xs" uppercase dot>Listo</Label>
                <Label variant="cream" look="ghost" size="xs">50 / 100 CP</Label>
              </div>
              <Button variant="legend" size="md" fullWidth icon={<IcCrown />}>
                ¡Ascender ahora!
              </Button>
            </Card>
          </Row>
        </Section>

        <div style={{ height: 20 }} />
      </div>
    </div>
  )
}
