import { useEffect, useState, lazy, Suspense } from 'react'
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

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 hidden lg:block"
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(139, 92, 246, 0.06), transparent 40%)`,
      }}
    />
  )
}

function AppContent() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { resolvedTheme } = useTheme()
  
  useLenis()

  useEffect(() => {
    // Mark as loaded after initial render
    setIsLoaded(true)
    
    // Apply theme classes to body
    document.body.classList.remove('light', 'dark')
    document.body.classList.add(resolvedTheme)
  }, [resolvedTheme])

  return (
    <>
      {/* Loading screen */}
      <LoadingScreen minDuration={1500} />
      
      <div className="min-h-screen bg-background text-foreground">
        {/* Mesh gradient background */}
        <div className="fixed inset-0 mesh-gradient pointer-events-none" />
        
        {/* Noise texture overlay */}
        <div className="noise-overlay" aria-hidden="true" />
        
        {/* Cursor glow effect */}
        <CursorGlow />
        
        <ScrollProgress />
        <Navbar />
        
        <main className="relative">
          <Hero />
          
          {/* Section divider */}
          <div className="relative h-px">
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
          
          <About />
          
          <div className="relative h-px">
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
          
          <Services />
          
          <div className="relative h-px">
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
          
          <Process />
          
          <div className="relative h-px">
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
          
          <Technologies />
          
          <div className="relative h-px">
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
          
          <Portfolio />
          
          <div className="relative h-px">
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
          
          <Testimonials />
          
          <div className="relative h-px">
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
          
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
