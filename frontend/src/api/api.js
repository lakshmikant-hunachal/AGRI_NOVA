const API_URL = 'http://localhost:3000/api';

// Helper to construct request headers with JWT authorization
const getHeaders = (extraHeaders = {}) => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...extraHeaders
  };
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Registration failed');
  return data;
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Login failed');
  
  // Store JWT token for subsequent requests
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

export const getUserProfile = async (email) => {
  const response = await fetch(`${API_URL}/user/profile?email=${email}`, {
    headers: getHeaders()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch profile');
  return data;
};

export const getUserScans = async (email) => {
  const response = await fetch(`${API_URL}/user/scans?email=${email}`, {
    headers: getHeaders()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch scans');
  return data;
};

export const saveScan = async (scanData) => {
  const response = await fetch(`${API_URL}/user/scans`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(scanData)
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to save scan');
  return data;
};

// Real AI Crop Scan
export const scanCropImage = async (imageBase64) => {
  const response = await fetch(`${API_URL}/scan`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ image: imageBase64 })
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'AI Crop Analysis failed');
  return data;
};

// Real AI Soil Scan
export const scanSoilImage = async (imageBase64) => {
  const response = await fetch(`${API_URL}/soil-scan`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ image: imageBase64 })
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'AI Soil Analysis failed');
  return data;
};

// Expert Chatbot Q&A
export const chatWithAI = async (message, history) => {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ message, history })
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Chatbot advisory failed');
  return data;
};

// Location Weather Advisory
export const getWeatherAdvisory = async (lat, lon) => {
  const response = await fetch(`${API_URL}/weather?lat=${lat}&lon=${lon}`, {
    headers: getHeaders()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch weather advisory');
  return data;
};

// Indian Mandi Crop Prices
export const getMandiPrices = async () => {
  const response = await fetch(`${API_URL}/mandi-prices`, {
    headers: getHeaders()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch Mandi prices');
  return data;
};

// Admin Dashboard Stats
export const getAdminStats = async () => {
  const response = await fetch(`${API_URL}/admin/stats`, {
    headers: getHeaders()
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Failed to fetch admin stats');
  return data;
};

