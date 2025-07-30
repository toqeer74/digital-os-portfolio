import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Minus, Square, Maximize2 } from 'lucide-react'

const Window = ({
  window,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onUpdatePosition,
  onUpdateSize
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const windowRef = useRef(null)

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls') || e.target.closest('.resize-handle')) return
    
    setIsDragging(true)
    onFocus()
    
    const rect = windowRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    
    const newPosition = {
      x: Math.max(0, Math.min(window.innerWidth - window.size.width, e.clientX - dragOffset.x)),
      y: Math.max(0, Math.min(window.innerHeight - window.size.height - 80, e.clientY - dragOffset.y))
    }
    
    onUpdatePosition(newPosition)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizing, dragOffset])

  if (window.isMinimized) return null

  const windowStyle = window.isMaximized
    ? { top: 0, left: 0, width: '100vw', height: 'calc(100vh - 80px)' }
    : {
        top: window.position.y,
        left: window.position.x,
        width: window.size.width,
        height: window.size.height
      }

  return (
    <motion.div
      ref={windowRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`absolute bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl overflow-hidden ${
        isActive ? 'z-50' : 'z-40'
      } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={windowStyle}
      onClick={onFocus}
    >
      {/* Window Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10 cursor-grab"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            {window.icon}
          </div>
          <h3 className="text-white font-medium">{window.title}</h3>
        </div>
        
        <div className="window-controls flex items-center space-x-2">
          <button
            onClick={onMinimize}
            className="w-6 h-6 rounded-full bg-yellow-500 hover:bg-yellow-400 flex items-center justify-center transition-colors"
          >
            <Minus size={12} className="text-yellow-900" />
          </button>
          
          <button
            onClick={onMaximize}
            className="w-6 h-6 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center transition-colors"
          >
            {window.isMaximized ? (
              <Square size={10} className="text-green-900" />
            ) : (
              <Maximize2 size={10} className="text-green-900" />
            )}
          </button>
          
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center transition-colors"
          >
            <X size={12} className="text-red-900" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="h-full overflow-auto bg-white/5">
        {window.component}
      </div>

      {/* Resize Handles */}
      {!window.isMaximized && (
        <>
          {/* Corner resize handles */}
          <div className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-white/20 hover:bg-white/30 transition-colors" />
          <div className="resize-handle absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize" />
          <div className="resize-handle absolute top-0 right-0 w-4 h-4 cursor-ne-resize" />
          <div className="resize-handle absolute top-0 left-0 w-4 h-4 cursor-nw-resize" />
          
          {/* Edge resize handles */}
          <div className="resize-handle absolute top-0 left-4 right-4 h-2 cursor-n-resize" />
          <div className="resize-handle absolute bottom-0 left-4 right-4 h-2 cursor-s-resize" />
          <div className="resize-handle absolute left-0 top-4 bottom-4 w-2 cursor-w-resize" />
          <div className="resize-handle absolute right-0 top-4 bottom-4 w-2 cursor-e-resize" />
        </>
      )}
    </motion.div>
  )
}

export default Window

