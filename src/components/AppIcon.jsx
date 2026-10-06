import {
  Activity,
  CalendarDays,
  CircleCheck,
  Clock,
  LayoutDashboard,
  Package,
  Palette,
  Sparkles,
  Store,
} from 'lucide-react'

// Pasangan simbol lama dengan ikon barunya
const iconMap = {
  '⌂': Store,
  '◈': Package,
  '▣': Palette,
  '✦': Sparkles,
  '▦': LayoutDashboard,
  '◔': Clock,
  '◷': CalendarDays,
  '✓': CircleCheck,
  '●': Activity,
}

function AppIcon({ name, size = 22 }) {
  const Icon = iconMap[name]

  // Kalau bukan simbol yang dikenal, tampilkan apa adanya
  if (!Icon) return <>{name}</>

  return <Icon size={size} aria-hidden="true" />
}

export default AppIcon