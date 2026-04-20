import { useEffect, useState } from 'react'
import { ThemeProvider, useTheme } from '@/hooks/useTheme'
import { useLenis } from '@/hooks/useLenis'
import { Navbar } from '@/components/Navbar'
import { ScrollProgress } from '@/components/ScrollProgress'
import { LoadingScreen } from '@/components/LoadingScreen'
import { Hero } from '@/sections/Hero'
import { About } from '@/sections/About'
import { Services } from '@/sections/Services'
import { Process } from '@/sections/Process'
import { Technologies } from '@/sections/Technologies'
import { Portfolio } from '@/sections/Portfolio'
import { Testimonials } from '@/sections/Testimonials'
import { Contact } from '@/sections/Contact'
import { Footer } from '@/sections/Footer'

// Cursor glow effect component
function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.body.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.body.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  if (!isVisible) return null

  const glowOpacity = resolvedTheme === 'dark' ? 0.08 : 0.04

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 hidden lg:block"
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(139, 92, 246, ${glowOpacity}), transparent 40%)`,
      }}
    />
  )
}

// Section divider component
function SectionDivider() {
  return (
    <div className="relative h-px">
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  )
}

function AppContent() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { resolvedTheme } = useTheme()
  
  useLenis()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <>
      {/* Loading screen */}
      <LoadingScreen minDuration={1500} />
      
      {/* Main app container - uses theme-aware background */}
      <div className="min-h-screen bg-background text-foreground relative">
        {/* Mesh gradient background - theme aware */}
        <div className="fixed inset-0 mesh-gradient pointer-events-none" />
        
        {/* Noise texture overlay */}
        <div className="noise-overlay" aria-hidden="true" />
        
        {/* Cursor glow effect */}
        <CursorGlow />
        
        <ScrollProgress />
        <Navbar />
        
        <main className="relative">
          <Hero />
          <SectionDivider />
          <About />
          <SectionDivider />
          <Services />
          <SectionDivider />
          <Process />
          <SectionDivider />
          <Technologies />
          <SectionDivider />
          <Portfolio />
          <SectionDivider />
          <Testimonials />
          <SectionDivider />
          <Contact />
        </main>
        
        <Footer />
      </div>
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
