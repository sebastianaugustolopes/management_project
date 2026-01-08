// Ensure API_BASE_URL always ends with /api
const getApiBaseUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    // Remove trailing slash if present
    const baseUrl = envUrl.replace(/\/$/, '');
    // Ensure /api is appended
    return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

const API_BASE_URL = getApiBaseUrl();

// Get token from localStorage
const getToken = () => {
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const userData = JSON.parse(user);
            return userData.token;
        } catch (e) {
            return null;
        }
    }
    return null;
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Unauthorized - clear token and redirect to login
                localStorage.removeItem('user');
                window.location.href = '/login';
                throw new Error('Unauthorized');
            }
            
            // Try to parse error message from response
            let errorMessage = 'Request failed';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
                
                // Handle validation errors
                if (errorData.errors && Array.isArray(errorData.errors)) {
                    errorMessage = errorData.errors.map(e => e.message || e).join(', ');
                }
            } catch (e) {
                // If response is not JSON, use status text
                errorMessage = response.statusText || errorMessage;
            }
            
            // Provide user-friendly messages for common status codes
            if (response.status === 400) {
                errorMessage = errorMessage || 'Invalid request. Please check your input.';
            } else if (response.status === 409) {
                errorMessage = errorMessage || 'This email is already registered.';
            } else if (response.status === 500) {
                errorMessage = 'Server error. Please try again later.';
            }
            
            throw new Error(errorMessage);
        }

        // Handle 204 No Content responses
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null;
        }

        return response.json();
    } catch (error) {
        // Handle network errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Unable to connect to the server. Please make sure the backend is running.');
        }
        throw error;
    }
};

// Auth API
export const authAPI = {
    login: async (email, password) => {
        return apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },
    register: async (name, email, password) => {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        });
    },
};

// Workspace API
export const workspaceAPI = {
    getAll: async () => {
        return apiRequest('/workspaces');
    },
    getById: async (id) => {
        return apiRequest(`/workspaces/${id}`);
    },
    create: async (workspace) => {
        return apiRequest('/workspaces', {
            method: 'POST',
            body: JSON.stringify(workspace),
        });
    },
    update: async (id, workspace) => {
        return apiRequest(`/workspaces/${id}`, {
            method: 'PUT',
            body: JSON.stringify(workspace),
        });
    },
    delete: async (id) => {
        return apiRequest(`/workspaces/${id}`, {
            method: 'DELETE',
        });
    },
    addMember: async (workspaceId, member) => {
        return apiRequest(`/workspaces/${workspaceId}/members`, {
            method: 'POST',
            body: JSON.stringify(member),
        });
    },
};

// Project API
export const projectAPI = {
    getAll: async () => {
        return apiRequest('/projects');
    },
    getById: async (id) => {
        return apiRequest(`/projects/${id}`);
    },
    create: async (project) => {
        return apiRequest('/projects', {
            method: 'POST',
            body: JSON.stringify(project),
        });
    },
    update: async (id, project) => {
        return apiRequest(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(project),
        });
    },
    delete: async (id) => {
        return apiRequest(`/projects/${id}`, {
            method: 'DELETE',
        });
    },
    getByWorkspace: async (workspaceId) => {
        return apiRequest(`/projects/workspace/${workspaceId}`);
    },
    addMember: async (projectId, member) => {
        return apiRequest(`/projects/${projectId}/members`, {
            method: 'POST',
            body: JSON.stringify(member),
        });
    },
};

// Task API
export const taskAPI = {
    getAll: async () => {
        return apiRequest('/tasks');
    },
    getById: async (id) => {
        return apiRequest(`/tasks/${id}`);
    },
    create: async (task) => {
        return apiRequest('/tasks', {
            method: 'POST',
            body: JSON.stringify(task),
        });
    },
    update: async (id, task) => {
        return apiRequest(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(task),
        });
    },
    delete: async (id) => {
        return apiRequest(`/tasks/${id}`, {
            method: 'DELETE',
        });
    },
    getByProject: async (projectId) => {
        return apiRequest(`/tasks/project/${projectId}`);
    },
};

// Comment API
export const commentAPI = {
    getByTask: async (taskId) => {
        return apiRequest(`/comments/task/${taskId}`);
    },
    create: async (taskId, comment) => {
        return apiRequest(`/comments/task/${taskId}`, {
            method: 'POST',
            body: JSON.stringify(comment),
        });
    },
    delete: async (id) => {
        return apiRequest(`/comments/${id}`, {
            method: 'DELETE',
        });
    },
};
