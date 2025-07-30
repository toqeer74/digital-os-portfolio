import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, 
  Star, 
  Download, 
  Search, 
  Filter,
  DollarSign,
  Package,
  Zap,
  Heart,
  Eye,
  TrendingUp
} from 'lucide-react'
import { useShop } from '../../hooks/useAPI'

const Shop = () => {
  const { products, fetchProducts, recordPurchase, loading, error } = useShop()
  const [filteredProducts, setFilteredProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cart, setCart] = useState([])
  const [sortBy, setSortBy] = useState('featured')

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = products.filter(product => product.active)

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.tags && JSON.parse(product.tags).some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      )
    }

    // Sort products
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      case 'popular':
        filtered.sort((a, b) => b.sales_count - a.sales_count)
        break
      default: // featured
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, searchQuery, sortBy])

  const categories = ['all', ...new Set(products.map(p => p.category))]

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const handlePurchase = async (product) => {
    try {
      await recordPurchase(product.id)
      // In a real app, this would integrate with Stripe
      alert(`Thank you for purchasing ${product.name}! Download link will be sent to your email.`)
      removeFromCart(product.id)
    } catch (err) {
      alert('Purchase failed. Please try again.')
    }
  }

  const ProductCard = ({ product }) => {
    const tags = product.tags ? JSON.parse(product.tags) : []
    const isInCart = cart.some(item => item.id === product.id)
    const hasDiscount = product.original_price && product.original_price > product.price

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -5 }}
        className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden cursor-pointer group relative"
        onClick={() => setSelectedProduct(product)}
      >
        {product.featured && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold rounded">
              FEATURED
            </span>
          </div>
        )}

        {hasDiscount && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
              -{Math.round((1 - product.price / product.original_price) * 100)}%
            </span>
          </div>
        )}
        
        <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 relative overflow-hidden">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
              {product.name}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation()
                // Toggle wishlist functionality
              }}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <Heart className="w-4 h-4 text-gray-400 hover:text-red-400" />
            </button>
          </div>
          
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
            {product.short_description || product.description}
          </p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">
                ${product.price}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.original_price}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Download className="w-4 h-4" />
              <span>{product.sales_count || 0} sales</span>
            </div>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {tags.slice(0, 2).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 2 && (
                <span className="px-2 py-1 bg-white/10 text-gray-400 rounded text-xs">
                  +{tags.length - 2}
                </span>
              )}
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                addToCart(product)
              }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-semibold transition-all ${
                isInCart
                  ? 'bg-green-500/20 text-green-400 border border-green-400/50'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{isInCart ? 'In Cart' : 'Add to Cart'}</span>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                handlePurchase(product)
              }}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all"
            >
              <Zap className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  const ProductModal = ({ product, onClose }) => {
    if (!product) return null

    const tags = product.tags ? JSON.parse(product.tags) : []
    const galleryImages = product.gallery_images ? JSON.parse(product.gallery_images) : []
    const hasDiscount = product.original_price && product.original_price > product.price

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div>
              <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg overflow-hidden mb-4">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-24 h-24 text-gray-400" />
                  </div>
                )}
              </div>
              
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {galleryImages.map((image, index) => (
                    <div key={index} className="aspect-square bg-white/10 rounded overflow-hidden">
                      <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Details */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{product.name}</h2>
                  <p className="text-gray-400">{product.category}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all"
                >
                  ×
                </button>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-white">
                    ${product.price}
                  </span>
                  {hasDiscount && (
                    <span className="text-lg text-gray-400 line-through">
                      ${product.original_price}
                    </span>
                  )}
                </div>
                
                {hasDiscount && (
                  <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded">
                    SAVE ${(product.original_price - product.price).toFixed(2)}
                  </span>
                )}
              </div>
              
              <div className="prose prose-invert max-w-none mb-6">
                <p className="text-gray-300 leading-relaxed">{product.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-gray-400">File Format</div>
                  <div className="text-white font-semibold">{product.file_format || 'Digital'}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-gray-400">File Size</div>
                  <div className="text-white font-semibold">{product.file_size || 'N/A'}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-gray-400">Sales</div>
                  <div className="text-white font-semibold">{product.sales_count || 0} downloads</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-gray-400">Stock</div>
                  <div className="text-white font-semibold">
                    {product.stock_quantity === -1 ? 'Unlimited' : product.stock_quantity}
                  </div>
                </div>
              </div>
              
              {tags.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-white/10 text-gray-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                
                <button
                  onClick={() => handlePurchase(product)}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all"
                >
                  <Zap className="w-5 h-5" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading products: {error}</p>
          <button
            onClick={() => fetchProducts()}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Digital Shop</h1>
            <p className="text-gray-400">Premium templates, tools, and resources</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">{products.length}</div>
              <div className="text-sm text-gray-400">Products</div>
            </div>
            {cart.length > 0 && (
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-purple-400" />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center space-x-2 flex-1">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
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
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400"
              >
                <option value="featured" className="bg-gray-800">Featured</option>
                <option value="newest" className="bg-gray-800">Newest</option>
                <option value="popular" className="bg-gray-800">Most Popular</option>
                <option value="price_low" className="bg-gray-800">Price: Low to High</option>
                <option value="price_high" className="bg-gray-800">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No products found</p>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Shop

