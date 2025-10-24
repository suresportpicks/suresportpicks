const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Helper function to get auth headers
const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
})

// User Management APIs
export const adminApi = {
  // Get all users with optional search and pagination
  getUsers: async (token, { search = '', page = 1, limit = 20 } = {}) => {
    const params = new URLSearchParams({ page, limit })
    if (search) params.append('search', search)
    
    const response = await fetch(`${API_BASE}/admin/users?${params}`, {
      headers: getAuthHeaders(token)
    })
    return response.json()
  },

  // Get user by ID
  getUserById: async (token, userId) => {
    const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
      headers: getAuthHeaders(token)
    })
    return response.json()
  },

  // Update user
  updateUser: async (token, userId, updates) => {
    const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(updates)
    })
    return response.json()
  },

  // Delete user
  deleteUser: async (token, userId) => {
    const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    })
    return response.json()
  },

  // Update user role
  updateUserRole: async (token, userId, role) => {
    const response = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ role })
    })
    return response.json()
  },

  // Update user status (active/inactive)
  updateUserStatus: async (token, userId, isActive) => {
    const response = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ isActive })
    })
    return response.json()
  },

  // Dashboard Statistics
  getDashboardStats: async (token) => {
    const response = await fetch(`${API_BASE}/admin/dashboard/stats`, {
      headers: getAuthHeaders(token)
    })
    return response.json()
  },

  // Dashboard Config (Admin)
  getDashboardConfig: async (token) => {
    const response = await fetch(`${API_BASE}/admin/dashboard/config`, {
      headers: getAuthHeaders(token)
    })
    return response.json()
  },
  updateDashboardConfig: async (token, payload) => {
    const response = await fetch(`${API_BASE}/admin/dashboard/config`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload)
    })
    return response.json()
  },

  // Transaction Management
  getTransactions: async (token, { page = 1, limit = 20, status = '', type = '' } = {}) => {
    const params = new URLSearchParams({ page, limit })
    if (status) params.append('status', status)
    if (type) params.append('type', type)
    
    const response = await fetch(`${API_BASE}/admin/transactions?${params}`, {
      headers: getAuthHeaders(token)
    })
    return response.json()
  },

  // Update transaction status
  updateTransactionStatus: async (token, transactionId, status) => {
    const response = await fetch(`${API_BASE}/admin/transactions/${transactionId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ status })
    })
    return response.json()
  },

  // Support Ticket Management
  getSupportTickets: async (token, { page = 1, limit = 20, status = '', priority = '' } = {}) => {
    const params = new URLSearchParams({ page, limit })
    if (status) params.append('status', status)
    if (priority) params.append('priority', priority)
    
    const response = await fetch(`${API_BASE}/admin/support/tickets?${params}`, {
      headers: getAuthHeaders(token)
    })
    return response.json()
  },

  // Update support ticket
  updateSupportTicket: async (token, ticketId, updates) => {
    const response = await fetch(`${API_BASE}/admin/support/tickets/${ticketId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(updates)
    })
    return response.json()
  },

  // Add response to support ticket
  addTicketResponse: async (token, ticketId, message) => {
    const response = await fetch(`${API_BASE}/admin/support-tickets/${ticketId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ response: message })
    })
    return response.json()
  },

  // ==================== PLAN MANAGEMENT APIs ====================

  // Get all plans for admin management
  getPlans: async (token) => {
    const response = await fetch(`${API_BASE}/admin/plans`, {
      headers: getAuthHeaders(token)
    })
    return response.json()
  },

  // Create a new plan
  createPlan: async (token, planData) => {
    const response = await fetch(`${API_BASE}/admin/plans`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(planData)
    })
    return response.json()
  },

  // Update a plan
  updatePlan: async (token, planId, planData) => {
    const response = await fetch(`${API_BASE}/admin/plans/${planId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(planData)
    })
    return response.json()
  },

  // Delete a plan
  deletePlan: async (token, planId) => {
    const response = await fetch(`${API_BASE}/admin/plans/${planId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token)
    })
    return response.json()
  },

  // Toggle plan active status
  togglePlanStatus: async (token, planId) => {
    const response = await fetch(`${API_BASE}/admin/plans/${planId}/toggle-status`, {
      method: 'PATCH',
      headers: getAuthHeaders(token)
    })
    return response.json()
  }
}

export default adminApi