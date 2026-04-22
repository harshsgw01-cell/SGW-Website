import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'


// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type Theme = 'dark' | 'light' | 'system'
type ResolvedTheme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isTransitioning: boolean
}


// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const STORAGE_KEY = 'theme'
const TRANSITION_DURATION = 350
const VALID_THEMES: Theme[] = ['dark', 'light', 'system']

const THEME_COLORS: Record<ResolvedTheme, { bg: string; fg: string }> = {
  dark: { bg: '#020617', fg: '#f1f5f9' },
  light: { bg: '#f9fafb', fg: '#0f172a' },
}


// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    // EDGE CASE FIX: Validate stored value — if localStorage was manually
    // tampered with (e.g. "Theme" or "1") treat it as invalid and reset to system.
    return stored && VALID_THEMES.includes(stored) ? stored : 'system'
  } catch {
    // EDGE CASE FIX: localStorage.getItem throws in private browsing on some
    // older Safari versions and in sandboxed iframes. Fail gracefully.
    return 'system'
  }
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme
}

function writeStoredTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Silently ignore — storage quota exceeded or sandboxed context
  }
}


// ─────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)


// ─────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(readStoredTheme()))
  const [isTransitioning, setIsTransitioning] = useState(false)

  // ENHANCEMENT: Store transition timer ref so we can cancel it
  // if setTheme is called again before the transition completes.
  // Previously a rapid dark→light→dark sequence left stale timers
  // that removed 'transitioning' class too early or too late.
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)


  // ── Core DOM mutation ──────────────────────
  const applyTheme = useCallback((newResolved: ResolvedTheme) => {
    const root = document.documentElement
    const body = document.body
    const colors = THEME_COLORS[newResolved]

    // Cancel any in-flight transition timer before starting a new one
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current)
    }

    // Signal React state for consumers that need to know (e.g. disable
    // animations during theme switch to prevent jarring repaints)
    setIsTransitioning(true)

    // Batch all DOM writes together before the browser paints
    // to avoid layout thrashing from interleaved reads/writes
    root.classList.add('transitioning')
    root.classList.remove('light', 'dark')
    body.classList.remove('light', 'dark')
    root.classList.add(newResolved)
    body.classList.add(newResolved)

    // Inline styles override CSS variables instantly — needed because
    // Tailwind v4 @theme inline variables have high specificity and
    // the class switch alone can lag one paint behind on slow devices
    root.style.backgroundColor = colors.bg
    root.style.color = colors.fg
    body.style.backgroundColor = colors.bg
    body.style.color = colors.fg

    // color-scheme tells the browser to style native UI (scrollbars,
    // form inputs, date pickers) to match the current theme
    root.style.colorScheme = newResolved

    // Update PWA / mobile browser chrome color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', colors.bg)
    }

    // ENHANCEMENT: Also update apple-mobile-web-app-status-bar-style
    // for iOS standalone PWA mode
    const metaApple = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
    if (metaApple) {
      metaApple.setAttribute('content', newResolved === 'dark' ? 'black-translucent' : 'default')
    }

    transitionTimerRef.current = setTimeout(() => {
      root.classList.remove('transitioning')
      setIsTransitioning(false)
      transitionTimerRef.current = null
    }, TRANSITION_DURATION)
  }, [])


  // ── Public setTheme ────────────────────────
  const setTheme = useCallback((newTheme: Theme) => {
    // EDGE CASE FIX: Validate input — guards against consumers passing
    // arbitrary strings (e.g. from URL params or user input)
    if (!VALID_THEMES.includes(newTheme)) {
      console.warn(`[useTheme] Invalid theme: "${newTheme}". Expected one of: ${VALID_THEMES.join(', ')}`)
      return
    }

    const newResolved = resolveTheme(newTheme)

    setThemeState(newTheme)
    setResolvedTheme(newResolved)
    writeStoredTheme(newTheme)
    applyTheme(newResolved)
  }, [applyTheme])


  // ── Toggle helper ──────────────────────────
  const toggleTheme = useCallback(() => {
    // Always toggles the resolved value, regardless of whether
    // current theme is 'system' — this is intentional. Once the
    // user manually toggles, we exit system mode and set explicit preference.
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])


  // ── Mount effect ───────────────────────────
  // ENHANCEMENT: Apply synchronously on mount to eliminate flash of
  // wrong theme. Also handles the case where SSR or pre-render set
  // incorrect initial classes that differ from stored preference.
  useEffect(() => {
    const stored = readStoredTheme()
    const resolved = resolveTheme(stored)

    // Only apply if it differs from what's already on the DOM
    // (avoids unnecessary transition on first load)
    const currentOnDom = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    if (currentOnDom !== resolved) {
      applyTheme(resolved)
    }

    setThemeState(stored)
    setResolvedTheme(resolved)

    return () => {
      // Clean up any pending transition timer on unmount
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps


  // ── System theme change listener ──────────
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      // Only react if user hasn't set an explicit preference
      if (theme !== 'system') return

      const newResolved: ResolvedTheme = e.matches ? 'dark' : 'light'
      setResolvedTheme(newResolved)
      applyTheme(newResolved)
    }

    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [theme, applyTheme])


  // ── Cross-tab sync ─────────────────────────
  // ENHANCEMENT: If the user changes theme in another browser tab,
  // sync it here without a full page reload.
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || e.newValue === null) return

      const newTheme = e.newValue as Theme
      if (!VALID_THEMES.includes(newTheme)) return

      const newResolved = resolveTheme(newTheme)
      setThemeState(newTheme)
      setResolvedTheme(newResolved)
      applyTheme(newResolved)
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [applyTheme])


  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme, toggleTheme, isTransitioning }}
    >
      {children}
    </ThemeContext.Provider>
  )
}


// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
