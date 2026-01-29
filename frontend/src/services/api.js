const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

async function fetchWithError(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to server. Please try again.');
    }
    throw error;
  }
}

export const api = {
  // Health check
  health: () => fetchWithError(`${API_BASE_URL}/health`),

  // Todo operations - will be added in US1
  todos: {
    list: () => fetchWithError(`${API_BASE_URL}/todos`),

    get: (id) => fetchWithError(`${API_BASE_URL}/todos/${id}`),

    create: (description) => fetchWithError(`${API_BASE_URL}/todos`, {
      method: 'POST',
      body: JSON.stringify({ description })
    }),

    update: (id, data) => fetchWithError(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

    delete: (id) => fetchWithError(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE'
    })
  },

  // Chat operations - will be added in US2
  chat: {
    send: (message) => fetchWithError(`${API_BASE_URL}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message })
    })
  }
};

export default api;
