import { motion } from 'framer-motion'
import { Menu, Search, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'

const Taskbar = ({ 
  windows, 
  activeWindow, 
  onWindowClick, 
  onStartMenuClick, 
  showStartMenu 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 h-20 bg-black/20 backdrop-blur-xl border-t border-white/10 z-50"
    >
      <div className="flex items-center justify-between h-full px-4">
        {/* Start Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartMenuClick}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
            showStartMenu 
              ? 'bg-white/20 text-white' 
              : 'bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white'
          }`}
        >
          <Menu size={20} />
          <span className="font-medium hidden sm:block">Start</span>
        </motion.button>

        {/* Window Buttons */}
        <div className="flex items-center space-x-2 flex-1 justify-center max-w-2xl mx-4">
          {windows.map(window => (
            <motion.button
              key={window.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onWindowClick(window.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 min-w-0 max-w-48 ${
                activeWindow === window.id
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white'
              } ${window.isMinimized ? 'opacity-60' : ''}`}
            >
              <div className="w-4 h-4 flex-shrink-0">
                {window.icon}
              </div>
              <span className="truncate text-sm font-medium hidden sm:block">
                {window.title}
              </span>
            </motion.button>
          ))}
        </div>

        {/* System Tray */}
        <div className="flex items-center space-x-4">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white transition-all duration-300"
            >
              <Search size={16} />
            </motion.button>
          </div>

          {/* Clock */}
          <div className="flex flex-col items-end text-right">
            <div className="text-white font-medium text-sm">
              {formatTime(currentTime)}
            </div>
            <div className="text-gray-400 text-xs">
              {formatDate(currentTime)}
            </div>
          </div>

          {/* System Status */}
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400 hidden lg:block">Online</span>
          </div>
        </div>
      </div>

      {/* Taskbar Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-purple-500/5 to-transparent pointer-events-none" />
    </motion.div>
  )
}

export default Taskbar

