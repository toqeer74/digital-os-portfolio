import { useState, useEffect } from 'react'

const API_BASE_URL = 'http://localhost:5000/api'

export const useAPI = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const apiCall = async (endpoint, options = {}) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setLoading(false)
      return data
    } catch (err) {
      setError(err.message)
      setLoading(false)
      throw err
    }
  }

  return { apiCall, loading, error }
}

// Specific API hooks
export const useProjects = () => {
  const [projects, setProjects] = useState([])
  const { apiCall, loading, error } = useAPI()

  const fetchProjects = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString()
      const response = await apiCall(`/projects?${queryParams}`)
      setProjects(response.data)
      return response.data
    } catch (err) {
      console.error('Error fetching projects:', err)
      return []
    }
  }

  const createProject = async (projectData) => {
    try {
      const response = await apiCall('/projects', {
        method: 'POST',
        body: JSON.stringify(projectData)
      })
      return response.data
    } catch (err) {
      console.error('Error creating project:', err)
      throw err
    }
  }

  const updateProject = async (id, projectData) => {
    try {
      const response = await apiCall(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(projectData)
      })
      return response.data
    } catch (err) {
      console.error('Error updating project:', err)
      throw err
    }
  }

  const deleteProject = async (id) => {
    try {
      await apiCall(`/projects/${id}`, {
        method: 'DELETE'
      })
      return true
    } catch (err) {
      console.error('Error deleting project:', err)
      throw err
    }
  }

  return {
    projects,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    loading,
    error
  }
}

export const useBlog = () => {
  const [posts, setPosts] = useState([])
  const { apiCall, loading, error } = useAPI()

  const fetchPosts = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString()
      const response = await apiCall(`/blog/posts?${queryParams}`)
      setPosts(response.data)
      return response.data
    } catch (err) {
      console.error('Error fetching blog posts:', err)
      return []
    }
  }

  const fetchPostBySlug = async (slug) => {
    try {
      const response = await apiCall(`/blog/posts/${slug}`)
      return response.data
    } catch (err) {
      console.error('Error fetching blog post:', err)
      throw err
    }
  }

  const createPost = async (postData) => {
    try {
      const response = await apiCall('/blog/posts', {
        method: 'POST',
        body: JSON.stringify(postData)
      })
      return response.data
    } catch (err) {
      console.error('Error creating blog post:', err)
      throw err
    }
  }

  return {
    posts,
    fetchPosts,
    fetchPostBySlug,
    createPost,
    loading,
    error
  }
}

export const useShop = () => {
  const [products, setProducts] = useState([])
  const { apiCall, loading, error } = useAPI()

  const fetchProducts = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString()
      const response = await apiCall(`/shop/products?${queryParams}`)
      setProducts(response.data)
      return response.data
    } catch (err) {
      console.error('Error fetching products:', err)
      return []
    }
  }

  const fetchProduct = async (id) => {
    try {
      const response = await apiCall(`/shop/products/${id}`)
      return response.data
    } catch (err) {
      console.error('Error fetching product:', err)
      throw err
    }
  }

  const recordPurchase = async (id) => {
    try {
      const response = await apiCall(`/shop/products/${id}/purchase`, {
        method: 'POST'
      })
      return response.data
    } catch (err) {
      console.error('Error recording purchase:', err)
      throw err
    }
  }

  return {
    products,
    fetchProducts,
    fetchProduct,
    recordPurchase,
    loading,
    error
  }
}

export const useContact = () => {
  const { apiCall, loading, error } = useAPI()

  const sendMessage = async (messageData) => {
    try {
      const response = await apiCall('/contact/messages', {
        method: 'POST',
        body: JSON.stringify(messageData)
      })
      return response.data
    } catch (err) {
      console.error('Error sending message:', err)
      throw err
    }
  }

  return {
    sendMessage,
    loading,
    error
  }
}

export const useAnalytics = () => {
  const { apiCall, loading, error } = useAPI()

  const trackPageView = async (pageData) => {
    try {
      await apiCall('/analytics/pageview', {
        method: 'POST',
        body: JSON.stringify(pageData)
      })
    } catch (err) {
      console.error('Error tracking page view:', err)
    }
  }

  const trackInteraction = async (interactionData) => {
    try {
      await apiCall('/analytics/interaction', {
        method: 'POST',
        body: JSON.stringify(interactionData)
      })
    } catch (err) {
      console.error('Error tracking interaction:', err)
    }
  }

  const getDashboardStats = async (days = 30) => {
    try {
      const response = await apiCall(`/analytics/dashboard?days=${days}`)
      return response.data
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
      throw err
    }
  }

  return {
    trackPageView,
    trackInteraction,
    getDashboardStats,
    loading,
    error
  }
}

