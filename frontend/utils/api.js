
export const apiClient = async (endpoint, options = {}) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }), 
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  const response = await fetch(`${baseUrl}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred during API communication context.');
  }

  return data;
};