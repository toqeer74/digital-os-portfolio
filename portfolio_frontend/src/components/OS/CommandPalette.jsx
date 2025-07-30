import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  User, 
  FolderOpen, 
  Brain, 
  Wrench, 
  BookOpen, 
  ShoppingBag, 
  Mail,
  ArrowRight,
  Command
} from 'lucide-react'

const CommandPalette = ({ onClose, onOpenApp }) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  const commands = [
    {
      id: 'portfolio',
      title: 'Portfolio',
      subtitle: 'View my projects and work',
      icon: <FolderOpen size={20} className="text-cyan-400" />,
      keywords: ['portfolio', 'projects', 'work', 'showcase'],
      action: () => onOpenApp({
        id: 'portfolio',
        title: 'Portfolio',
        icon: <FolderOpen size={16} className="text-cyan-400" />,
        component: <div className="p-6 text-white">Portfolio App Content</div>
      })
    },
    {
      id: 'ai-lab',
      title: 'AI Lab',
      subtitle: 'AI tools and experiments',
      icon: <Brain size={20} className="text-purple-400" />,
      keywords: ['ai', 'artificial intelligence', 'lab', 'tools', 'experiments'],
      action: () => onOpenApp({
        id: 'ai-lab',
        title: 'AI Lab',
        icon: <Brain size={16} className="text-purple-400" />,
        component: <div className="p-6 text-white">AI Lab Content</div>
      })
    },
    {
      id: 'toolbox',
      title: 'Toolbox',
      subtitle: 'Development tools and skills',
      icon: <Wrench size={20} className="text-orange-400" />,
      keywords: ['toolbox', 'tools', 'development', 'skills', 'tech'],
      action: () => onOpenApp({
        id: 'toolbox',
        title: 'Toolbox',
        icon: <Wrench size={16} className="text-orange-400" />,
        component: <div className="p-6 text-white">Toolbox Content</div>
      })
    },
    {
      id: 'journal',
      title: 'Journal',
      subtitle: 'Blog posts and articles',
      icon: <BookOpen size={20} className="text-green-400" />,
      keywords: ['journal', 'blog', 'articles', 'writing', 'posts'],
      action: () => onOpenApp({
        id: 'journal',
        title: 'Journal',
        icon: <BookOpen size={16} className="text-green-400" />,
        component: <div className="p-6 text-white">Journal Content</div>
      })
    },
    {
      id: 'shop',
      title: 'Shop',
      subtitle: 'Digital products and templates',
      icon: <ShoppingBag size={20} className="text-pink-400" />,
      keywords: ['shop', 'store', 'products', 'templates', 'buy'],
      action: () => onOpenApp({
        id: 'shop',
        title: 'Shop',
        icon: <ShoppingBag size={16} className="text-pink-400" />,
        component: <div className="p-6 text-white">Shop Content</div>
      })
    },
    {
      id: 'contact',
      title: 'Contact',
      subtitle: 'Get in touch',
      icon: <Mail size={20} className="text-blue-400" />,
      keywords: ['contact', 'email', 'message', 'reach out', 'touch'],
      action: () => onOpenApp({
        id: 'contact',
        title: 'Contact',
        icon: <Mail size={16} className="text-blue-400" />,
        component: <div className="p-6 text-white">Contact Content</div>
      })
    },
    {
      id: 'about',
      title: 'About',
      subtitle: 'Learn more about me',
      icon: <User size={20} className="text-yellow-400" />,
      keywords: ['about', 'bio', 'me', 'profile', 'information'],
      action: () => onOpenApp({
        id: 'about',
        title: 'About',
        icon: <User size={16} className="text-yellow-400" />,
        component: <div className="p-6 text-white">About Content</div>
      })
    }
  ]

  const filteredCommands = commands.filter(command => {
    if (!query) return true
    
    const searchTerm = query.toLowerCase()
    return (
      command.title.toLowerCase().includes(searchTerm) ||
      command.subtitle.toLowerCase().includes(searchTerm) ||
      command.keywords.some(keyword => keyword.includes(searchTerm))
    )
  })

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action()
          onClose()
        }
        break
      case 'Escape':
        onClose()
        break
    }
  }

  const handleCommandClick = (command) => {
    command.action()
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-32"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        className="w-full max-w-2xl mx-4 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-4 border-b border-white/10">
          <Search size={20} className="text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for apps, projects, or anything..."
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-lg"
          />
          <div className="flex items-center space-x-1 text-gray-400 text-sm">
            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">↑↓</kbd>
            <span>navigate</span>
            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">↵</kbd>
            <span>select</span>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          <AnimatePresence>
            {filteredCommands.length > 0 ? (
              filteredCommands.map((command, index) => (
                <motion.div
                  key={command.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center px-4 py-3 cursor-pointer transition-all duration-200 ${
                    index === selectedIndex
                      ? 'bg-white/10 border-l-2 border-cyan-400'
                      : 'hover:bg-white/5'
                  }`}
                  onClick={() => handleCommandClick(command)}
                >
                  <div className="mr-3">
                    {command.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{command.title}</div>
                    <div className="text-gray-400 text-sm">{command.subtitle}</div>
                  </div>
                  <ArrowRight size={16} className="text-gray-400" />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-gray-400"
              >
                <Search size={48} className="mb-4 opacity-50" />
                <p className="text-lg">No results found</p>
                <p className="text-sm">Try searching for something else</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-white/5 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Command size={12} />
                <span>Command Palette</span>
              </div>
              <span>{filteredCommands.length} results</span>
            </div>
            <div className="flex items-center space-x-1">
              <kbd className="px-2 py-1 bg-white/10 rounded">Esc</kbd>
              <span>to close</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CommandPalette

