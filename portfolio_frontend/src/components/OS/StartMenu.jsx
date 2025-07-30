import { motion } from 'framer-motion'
import { 
  User, 
  FolderOpen, 
  Brain, 
  Wrench, 
  BookOpen, 
  ShoppingBag, 
  Mail,
  Settings,
  Power,
  Github,
  Linkedin,
  Twitter
} from 'lucide-react'
import Portfolio from '../Apps/Portfolio'
import Shop from '../Apps/Shop'

const StartMenu = ({ onClose, onOpenApp }) => {
  const apps = [
    {
      id: 'portfolio',
      title: 'Portfolio',
      icon: <FolderOpen size={24} className="text-cyan-400" />,
      description: 'View my projects and work',
      category: 'main',
      component: <Portfolio />
    },
    {
      id: 'ai-lab',
      title: 'AI Lab',
      icon: <Brain size={24} className="text-purple-400" />,
      description: 'AI tools and experiments',
      category: 'main',
      component: <div className="p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">AI Lab</h2>
        <p className="text-gray-300">Coming soon! This will feature AI-powered tools and experiments.</p>
      </div>
    },
    {
      id: 'toolbox',
      title: 'Toolbox',
      icon: <Wrench size={24} className="text-orange-400" />,
      description: 'Development tools and skills',
      category: 'main',
      component: <div className="p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Developer Toolbox</h2>
        <p className="text-gray-300">A collection of development tools, utilities, and skill showcases.</p>
      </div>
    },
    {
      id: 'journal',
      title: 'Journal',
      icon: <BookOpen size={24} className="text-green-400" />,
      description: 'Blog posts and articles',
      category: 'main',
      component: <div className="p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Developer Journal</h2>
        <p className="text-gray-300">Blog posts, tutorials, and insights from my development journey.</p>
      </div>
    },
    {
      id: 'shop',
      title: 'Shop',
      icon: <ShoppingBag size={24} className="text-pink-400" />,
      description: 'Digital products and templates',
      category: 'main',
      component: <Shop />
    },
    {
      id: 'contact',
      title: 'Contact',
      icon: <Mail size={24} className="text-blue-400" />,
      description: 'Get in touch',
      category: 'main',
      component: <div className="p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Contact Me</h2>
        <p className="text-gray-300">Let's connect! Send me a message or find me on social media.</p>
      </div>
    },
    {
      id: 'about',
      title: 'About',
      icon: <User size={24} className="text-yellow-400" />,
      description: 'Learn more about me',
      category: 'secondary',
      component: <div className="p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">About Toqeer Ahmad</h2>
        <p className="text-gray-300">Full Stack Developer passionate about automation, AI, and creating digital experiences.</p>
      </div>
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings size={24} className="text-gray-400" />,
      description: 'System preferences',
      category: 'secondary',
      component: <div className="p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">System Settings</h2>
        <p className="text-gray-300">Customize your Digital OS experience.</p>
      </div>
    }
  ]

  const mainApps = apps.filter(app => app.category === 'main')
  const secondaryApps = apps.filter(app => app.category === 'secondary')

  const socialLinks = [
    { icon: <Github size={20} />, label: 'GitHub', url: 'https://github.com' },
    { icon: <Linkedin size={20} />, label: 'LinkedIn', url: 'https://linkedin.com' },
    { icon: <Twitter size={20} />, label: 'Twitter', url: 'https://twitter.com' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        className="absolute bottom-24 left-4 w-96 bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Toqeer Ahmad</h3>
              <p className="text-gray-400 text-sm">Full Stack Developer</p>
            </div>
          </div>
        </div>

        {/* Main Apps */}
        <div className="p-4">
          <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-3">Applications</h4>
          <div className="grid grid-cols-2 gap-2">
            {mainApps.map(app => (
              <motion.button
                key={app.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenApp(app)}
                className="flex flex-col items-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="mb-2 group-hover:scale-110 transition-transform duration-300">
                  {app.icon}
                </div>
                <span className="text-white text-sm font-medium">{app.title}</span>
                <span className="text-gray-400 text-xs text-center mt-1">{app.description}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Secondary Apps */}
        <div className="px-4 pb-4">
          <div className="flex space-x-2">
            {secondaryApps.map(app => (
              <motion.button
                key={app.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onOpenApp(app)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 flex-1"
              >
                <div className="w-5 h-5">
                  {app.icon}
                </div>
                <span className="text-white text-sm">{app.title}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white/5 border-t border-white/10">
          <div className="flex items-center justify-between">
            {/* Social Links */}
            <div className="flex space-x-2">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all duration-300"
                  title={link.label}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>

            {/* Power Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-300"
              title="Shutdown"
            >
              <Power size={16} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default StartMenu

