import axiosClient from './axiosClient';

const authApi = {
  // Login user
  login: async (credentials) => {
    // credentials = { email, password }
    const response = await axiosClient.post('/auth/login', credentials);

    // Store tokens if present in response
    if (response?.data?.token) {
      localStorage.setItem('finora_token', response?.data?.token);
    }
    return response;
  },

  // Register new user
  register: (userData) => {
    // userData = { name, email, password }
    return axiosClient.post('/auth/register', userData);
  },

  // Fetch current user profile
  getProfile: () => {
    return axiosClient.get('/auth/profile');
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('finora_token');
    localStorage.removeItem('finora_refresh_token');
    return axiosClient.post('/auth/logout');
  },
};

export default authApi;