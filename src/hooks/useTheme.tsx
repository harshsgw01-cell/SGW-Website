import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'

type Theme = 'dark' | 'light' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'dark' | 'light'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem('theme') as Theme | null
  return stored || 'system'
}

function getInitialResolvedTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem('theme') as Theme | null
  if (stored && stored !== 'system') return stored
  return getSystemTheme()
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>(getInitialResolvedTheme)

  const applyTheme = useCallback((newResolvedTheme: 'dark' | 'light') => {
    const root = document.documentElement
    const body = document.body

    // Add transitioning class for smooth animation
    root.classList.add('transitioning')

    // Remove old theme class and add new one
    root.classList.remove('light', 'dark')
    body.classList.remove('light', 'dark')
    
    root.classList.add(newResolvedTheme)
    body.classList.add(newResolvedTheme)

    // Force background color application
    if (newResolvedTheme === 'dark') {
      root.style.backgroundColor = '#0a0a0f'
      root.style.color = '#fafafa'
      body.style.backgroundColor = '#0a0a0f'
      body.style.color = '#fafafa'
    } else {
      root.style.backgroundColor = '#fafafa'
      root.style.color = '#0a0a0f'
      body.style.backgroundColor = '#fafafa'
      body.style.color = '#0a0a0f'
    }

    // Update theme-color meta tag
    const themeColor = newResolvedTheme === 'dark' ? '#0a0a0f' : '#fafafa'
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', themeColor)
    }

    // Remove transitioning class after animation completes
    setTimeout(() => {
      root.classList.remove('transitioning')
    }, 350)
  }, [])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    
    const newResolved = newTheme === 'system' ? getSystemTheme() : newTheme
    setResolvedTheme(newResolved)
    applyTheme(newResolved)
  }, [applyTheme])

  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }, [resolvedTheme, setTheme])

  // Apply theme on initial mount
  useEffect(() => {
    const resolved = theme === 'system' ? getSystemTheme() : theme
    setResolvedTheme(resolved)
    applyTheme(resolved)
  }, []) // Only run once on mount

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const newResolved = e.matches ? 'dark' : 'light'
        setResolvedTheme(newResolved)
        applyTheme(newResolved)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, applyTheme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
