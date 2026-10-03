import axios from 'axios'

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'http://127.0.0.1:8000/api',

  headers: {
    Accept: 'application/json',
  },
})

/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(
    'keramik_dinoyo_token',
  )

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  } else {
    config.headers['Content-Type'] =
      'application/json'
  }

  return config
})

/*
|--------------------------------------------------------------------------
| Auth
|--------------------------------------------------------------------------
*/

export const login = (data) =>
  api.post('/login', data)

export const logout = () =>
  api.post('/logout')

export const getMe = () =>
  api.get('/me')

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const getDashboard = () =>
  api.get('/dashboard')

/*
|--------------------------------------------------------------------------
| Shops
|--------------------------------------------------------------------------
*/

export const getShops = () =>
  api.get('/shops')

export const getShop = (id) =>
  api.get(`/shops/${id}`)

export const createShop = (data) =>
  api.post('/shops', data)

export const updateShop = (id, data) =>
  api.post(`/shops/${id}`, data)

export const deleteShop = (id) =>
  api.delete(`/shops/${id}`)

/*
|--------------------------------------------------------------------------
| Products
|--------------------------------------------------------------------------
*/

export const getProducts = (params = {}) =>
  api.get('/products', {
    params,
  })

export const getProduct = (id) =>
  api.get(`/products/${id}`)

export const createProduct = (data) =>
  api.post('/products', data)

export const updateProduct = (id, data) =>
  api.post(`/products/${id}`, data)

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`)

/*
|--------------------------------------------------------------------------
| Workshops
|--------------------------------------------------------------------------
*/

export const getWorkshops = () =>
  api.get('/workshops')

export const getWorkshop = (id) =>
  api.get(`/workshops/${id}`)

export const createWorkshop = (data) =>
  api.post('/workshops', data)

export const updateWorkshop = (id, data) =>
  api.post(`/workshops/${id}`, data)

export const deleteWorkshop = (id) =>
  api.delete(`/workshops/${id}`)

/*
|--------------------------------------------------------------------------
| Transactions
|--------------------------------------------------------------------------
*/

export const getTransactions = (params = {}) =>
  api.get('/transactions', {
    params,
  })

export const getTransaction = (id) =>
  api.get(`/transactions/${id}`)

export const createTransaction = (data) =>
  api.post('/transactions', data)

export const updateTransaction = (id, data) =>
  api.post(`/transactions/${id}`, data)

export const deleteTransaction = (id) =>
  api.delete(`/transactions/${id}`)

/*
|--------------------------------------------------------------------------
| Reviews
|--------------------------------------------------------------------------
*/

export const getReviews = (params = {}) =>
  api.get('/reviews', {
    params,
  })

export const getReview = (id) =>
  api.get(`/reviews/${id}`)

export const createReview = (data) =>
  api.post('/reviews', data)

export const updateReview = (id, data) =>
  api.post(`/reviews/${id}`, data)

export const deleteReview = (id) =>
  api.delete(`/reviews/${id}`)

/*
|--------------------------------------------------------------------------
| AI
|--------------------------------------------------------------------------
*/

export const ceramicFinder = (data) =>
  api.post('/ai/ceramic-finder', data)

export const getAiAnalysisResults = () =>
  api.get('/ai/analysis-results')

export default api