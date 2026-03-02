import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  axios.defaults.baseURL = API_BASE_URL;

  useEffect(() => {
  const devAutoLogin = import.meta.env.VITE_DEV_AUTO_LOGIN === 'true';

  //DEV MODE: fake user (NO BACKEND)
  if (devAutoLogin) {
    const demoUser = {
      id: 'dev-user-1',
      name: 'Iksha Malhotra',
      role: 'Jr Executive Engineer' // change role anytime
    };

    setUser(demoUser);
    setLoading(false);
    return;
  }

  // 🔐 NORMAL MODE (real login)
  const storedUser = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (storedUser && token) {
    setUser(JSON.parse(storedUser));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  setLoading(false);
}, []);


  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { user: userData, token } = response.data;

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return userData;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};