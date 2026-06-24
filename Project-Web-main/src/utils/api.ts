const API_BASE = '/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

// Auth API
export const authAPI = {
  register: (data: { full_name: string; email: string; password: string }) =>
    request('/auth/register', { method: 'POST', body: data }),
  login: (data: { email: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: data }),
  adminLogin: (data: { username: string; password: string }) =>
    request('/auth/admin/login', { method: 'POST', body: data }),
  verify: () => request('/auth/verify'),
};

// Orangutans API
export const orangutansAPI = {
  getAll: () => request('/orangutans'),
  getOne: (id: number) => request(`/orangutans/${id}`),
  create: (data: unknown) => request('/orangutans', { method: 'POST', body: data }),
  update: (id: number, data: unknown) => request(`/orangutans/${id}`, { method: 'PUT', body: data }),
  delete: (id: number) => request(`/orangutans/${id}`, { method: 'DELETE' }),
};

// Donations API
export const donationsAPI = {
  create: (data: { amount: number; payment_method: string }) =>
    request('/donations', { method: 'POST', body: data }),
  getMyDonations: () => request('/donations/my-donations'),
  getMyStats: () => request('/donations/my-stats'),
  getAll: () => request('/donations/all'),
  getStatistics: () => request('/donations/statistics'),
};

// Articles API
export const articlesAPI = {
  getAll: () => request('/articles'),
  getOne: (id: number) => request(`/articles/${id}`),
  create: (data: unknown) => request('/articles', { method: 'POST', body: data }),
  update: (id: number, data: unknown) => request(`/articles/${id}`, { method: 'PUT', body: data }),
  delete: (id: number) => request(`/articles/${id}`, { method: 'DELETE' }),
};

// Users API
export const usersAPI = {
  getProfile: () => request('/users/profile'),
  updateProfile: (data: unknown) => request('/users/profile', { method: 'PUT', body: data }),
  changePassword: (data: { current_password: string; new_password: string }) =>
    request('/users/password', { method: 'PUT', body: data }),
  getAll: () => request('/users/all'),
  updateStatus: (id: number, status: string) =>
    request(`/users/${id}/status`, { method: 'PUT', body: { status } }),
  delete: (id: number) => request(`/users/${id}`, { method: 'DELETE' }),
};

// FAQs API
export const faqsAPI = {
  getAll: () => request('/faqs'),
  create: (data: unknown) => request('/faqs', { method: 'POST', body: data }),
  update: (id: number, data: unknown) => request(`/faqs/${id}`, { method: 'PUT', body: data }),
  delete: (id: number) => request(`/faqs/${id}`, { method: 'DELETE' }),
};

// Contacts API
export const contactsAPI = {
  submit: (data: { name: string; email: string; message: string }) =>
    request('/contacts', { method: 'POST', body: data }),
  getAll: () => request('/contacts'),
  delete: (id: number) => request(`/contacts/${id}`, { method: 'DELETE' }),
};

// Admin API
export const adminAPI = {
  getDashboard: () => request('/admin/dashboard'),
  getActivityLogs: () => request('/admin/activity-logs'),
};
