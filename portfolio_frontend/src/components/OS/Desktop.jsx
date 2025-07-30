import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Taskbar from './Taskbar'
import Window from './Window'
import StartMenu from './StartMenu'
import CommandPalette from './CommandPalette'

const Desktop = () => {
  const [windows, setWindows] = useState([])
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [activeWindow, setActiveWindow] = useState(null)

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Command palette (Cmd/Ctrl + K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowCommandPalette(true)
      }
      
      // Search (/)
      if (e.key === '/' && !e.target.matches('input, textarea')) {
        e.preventDefault()
        setShowCommandPalette(true)
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        setShowStartMenu(false)
        setShowCommandPalette(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const openWindow = (appConfig) => {
    const newWindow = {
      id: Date.now(),
      ...appConfig,
      position: { x: 100 + windows.length * 30, y: 100 + windows.length * 30 },
      size: { width: 800, height: 600 },
      isMinimized: false,
      isMaximized: false
    }
    
    setWindows(prev => [...prev, newWindow])
    setActiveWindow(newWindow.id)
    setShowStartMenu(false)
  }

  const closeWindow = (windowId) => {
    setWindows(prev => prev.filter(w => w.id !== windowId))
    if (activeWindow === windowId) {
      const remainingWindows = windows.filter(w => w.id !== windowId)
      setActiveWindow(remainingWindows.length > 0 ? remainingWindows[remainingWindows.length - 1].id : null)
    }
  }

  const minimizeWindow = (windowId) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: true } : w
    ))
  }

  const maximizeWindow = (windowId) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
    ))
  }

  const focusWindow = (windowId) => {
    setActiveWindow(windowId)
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: false } : w
    ))
  }

  const updateWindowPosition = (windowId, position) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, position } : w
    ))
  }

  const updateWindowSize = (windowId, size) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, size } : w
    ))
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('/src/assets/backgrounds/tech_background_1.jpg')`
        }}
      />
      
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-cyan-900/30" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
            animate={{
              x: [0, Math.random() * window.innerWidth],
              y: [0, Math.random() * window.innerHeight],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: Math.random() * window.innerWidth,
              top: Math.random() * window.innerHeight
            }}
          />
        ))}
      </div>

      {/* Desktop content area */}
      <div className="relative z-10 w-full h-full">
        {/* Hero section when no windows are open */}
        <AnimatePresence>
          {windows.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-full text-center px-8"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-6xl md:text-8xl font-bold text-white mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              >
                Toqeer.dev
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl"
              >
                Automation. Intelligence. Design. Welcome to my Digital OS
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4 justify-center"
              >
                <button
                  onClick={() => setShowStartMenu(true)}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                >
                  Explore Apps
                </button>
                
                <button
                  onClick={() => setShowCommandPalette(true)}
                  className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  Quick Search
                </button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-32 text-gray-400 text-sm"
              >
                Press <kbd className="px-2 py-1 bg-white/10 rounded">Cmd+K</kbd> or <kbd className="px-2 py-1 bg-white/10 rounded">/</kbd> to search
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Windows */}
        <AnimatePresence>
          {windows.map(window => (
            <Window
              key={window.id}
              window={window}
              isActive={activeWindow === window.id}
              onClose={() => closeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onMaximize={() => maximizeWindow(window.id)}
              onFocus={() => focusWindow(window.id)}
              onUpdatePosition={(position) => updateWindowPosition(window.id, position)}
              onUpdateSize={(size) => updateWindowSize(window.id, size)}
            />
          ))}
        </AnimatePresence>

        {/* Start Menu */}
        <AnimatePresence>
          {showStartMenu && (
            <StartMenu
              onClose={() => setShowStartMenu(false)}
              onOpenApp={openWindow}
            />
          )}
        </AnimatePresence>

        {/* Command Palette */}
        <AnimatePresence>
          {showCommandPalette && (
            <CommandPalette
              onClose={() => setShowCommandPalette(false)}
              onOpenApp={openWindow}
            />
          )}
        </AnimatePresence>

        {/* Taskbar */}
        <Taskbar
          windows={windows}
          activeWindow={activeWindow}
          onWindowClick={focusWindow}
          onStartMenuClick={() => setShowStartMenu(!showStartMenu)}
          showStartMenu={showStartMenu}
        />
      </div>
    </div>
  )
}

export default Desktop

