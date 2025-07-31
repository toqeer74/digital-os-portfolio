import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ExternalLink, 
  Github, 
  Filter, 
  Search, 
  Star,
  Calendar,
  Code,
  Eye,
  Grid3X3,
  List,
  Sparkles,
  TrendingUp
} from 'lucide-react'
import { useProjects } from '../../hooks/useAPI'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

const EnhancedPortfolio = () => {
  const { projects, fetchProjects, loading, error } = useProjects()
  const [filteredProjects, setFilteredProjects] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    let filtered = [...projects]

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.tags && JSON.parse(project.tags).some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      )
    }

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at)
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at)
        case 'name':
          return a.title.localeCompare(b.title)
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        default:
          return 0
      }
    })

    setFilteredProjects(filtered)
  }, [projects, selectedCategory, searchQuery, sortBy])

  const categories = ['all', ...new Set(projects.map(p => p.category))]
  const featuredProjects = projects.filter(p => p.featured)

  const ProjectCard = ({ project, variant = 'default' }) => {
    const tags = project.tags ? JSON.parse(project.tags) : []
    const techStack = project.tech_stack ? JSON.parse(project.tech_stack) : []

    return (
      <Card 
        variant={project.featured ? 'gradient' : 'glass'}
        className="cursor-pointer group overflow-hidden"
        onClick={() => setSelectedProject(project)}
      >
        {project.image_url && (
          <div className="aspect-video relative overflow-hidden">
            <img 
              src={project.image_url} 
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {project.featured && (
              <div className="absolute top-3 right-3">
                <Badge variant="neon" animate>
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              </div>
            )}
            <div className="absolute bottom-3 left-3">
              <Badge variant="glass" animate>
                {project.category}
              </Badge>
            </div>
          </div>
        )}
        
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg group-hover:text-cyan-400 transition-colors">
              {project.title}
            </CardTitle>
            <Badge 
              variant={
                project.status === 'completed' ? 'tech' :
                project.status === 'in_progress' ? 'category' :
                'outline'
              }
            >
              {project.status?.replace('_', ' ')}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">
            {project.short_description || project.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="glass" animate>
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" animate>
                  +{tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-gray-400 text-sm">
              {project.created_at && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(project.created_at).getFullYear()}</span>
                </div>
              )}
              {techStack.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Code className="w-4 h-4" />
                  <span>{techStack.length}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {project.github_url && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(project.github_url, '_blank')
                  }}
                >
                  <Github className="w-4 h-4" />
                </Button>
              )}
              {project.demo_url && (
                <Button
                  variant="neon"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(project.demo_url, '_blank')
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const ProjectModal = ({ project, onClose }) => {
    if (!project) return null

    const tags = project.tags ? JSON.parse(project.tags) : []
    const techStack = project.tech_stack ? JSON.parse(project.tech_stack) : []

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {project.image_url && (
            <div className="aspect-video relative overflow-hidden rounded-t-xl">
              <img 
                src={project.image_url} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {project.featured && (
                <div className="absolute top-4 left-4">
                  <Badge variant="neon" animate>
                    <Sparkles className="w-3 h-3 mr-1" />
                    Featured Project
                  </Badge>
                </div>
              )}
            </div>
          )}
          
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{project.title}</h2>
                <div className="flex items-center space-x-3">
                  <Badge variant="category">{project.category}</Badge>
                  <Badge variant={
                    project.status === 'completed' ? 'tech' :
                    project.status === 'in_progress' ? 'category' :
                    'outline'
                  }>
                    {project.status?.replace('_', ' ')}
                  </Badge>
                  {project.created_at && (
                    <div className="flex items-center space-x-1 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                ×
              </Button>
            </div>
            
            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-gray-300 leading-relaxed text-lg">{project.description}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {tags.length > 0 && (
                <div>
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="glass" animate>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {techStack.length > 0 && (
                <div>
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech, index) => (
                      <Badge key={index} variant="tech" animate>
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {project.demo_url && (
                <Button
                  variant="gradient"
                  onClick={() => window.open(project.demo_url, '_blank')}
                  className="flex items-center space-x-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>View Live Demo</span>
                </Button>
              )}
              
              {project.github_url && (
                <Button
                  variant="glass"
                  onClick={() => window.open(project.github_url, '_blank')}
                  className="flex items-center space-x-2"
                >
                  <Github className="w-5 h-5" />
                  <span>View Source</span>
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  if (loading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card variant="glass" className="p-8 text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading projects...</p>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card variant="glass" className="p-8 text-center">
          <p className="text-red-400 mb-4">Error loading projects: {error}</p>
          <Button variant="gradient" onClick={() => fetchProjects()}>
            Retry
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <Sparkles className="w-8 h-8 mr-3 text-cyan-400" />
              Portfolio
            </h1>
            <p className="text-gray-400">Showcasing my creative work and technical expertise</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-cyan-400">{projects.length}</div>
            <div className="text-sm text-gray-400">Total Projects</div>
          </div>
        </div>

        {/* Featured Projects Preview */}
        {featuredProjects.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-400" />
              Featured Projects
            </h3>
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {featuredProjects.slice(0, 3).map(project => (
                <div
                  key={project.id}
                  className="flex-shrink-0 w-48 cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <Card variant="neon" className="p-3">
                    <div className="text-sm font-medium text-white truncate">{project.title}</div>
                    <div className="text-xs text-gray-400 truncate">{project.category}</div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center space-x-2 flex-1">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects, tags, or technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400 min-w-[120px]"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-gray-800">
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="newest" className="bg-gray-800">Newest First</option>
              <option value="oldest" className="bg-gray-800">Oldest First</option>
              <option value="name" className="bg-gray-800">Name A-Z</option>
              <option value="featured" className="bg-gray-800">Featured First</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'neon' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'neon' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Card variant="glass" className="p-8 max-w-md mx-auto">
              <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No projects found</p>
              <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
            </Card>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            <AnimatePresence>
              {filteredProjects.map(project => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default EnhancedPortfolio

