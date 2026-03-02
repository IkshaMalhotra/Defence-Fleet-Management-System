import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Vehicle APIs
export const vehicleAPI = {
  getAll: () => axios.get('/vehicles'),
  getById: (id) => axios.get(`/vehicles/${id}`),
  create: (data) => axios.post('/vehicles', data),
  update: (id, data) => axios.put(`/vehicles/${id}`, data),
  delete: (id) => axios.delete(`/vehicles/${id}`),
};

// Maintenance Request APIs
export const maintenanceAPI = {
  create: (data) => axios.post('/maintenance', data),
  getAll: () => axios.get('/maintenance'),
  getById: (id) => axios.get(`/maintenance/${id}`),
  
  // Vehicle Manager
  getMyRequests: () => axios.get('/maintenance/my-requests'),
  
  // Jr Executive
  getPendingForJrExec: () => axios.get('/maintenance/jr-executive/pending'),
  approveByJrExec: (id, comment) => 
    axios.put(`/maintenance/${id}/jr-executive/approve`, { comment }),
  rejectByJrExec: (id, comment) => 
    axios.put(`/maintenance/${id}/jr-executive/reject`, { comment }),
  
  // OIC
  getPendingForOIC: () => axios.get('/maintenance/oic/pending'),
  approveByOIC: (id, comment) => 
    axios.put(`/maintenance/${id}/oic/approve`, { comment }),
  rejectByOIC: (id, comment) => 
    axios.put(`/maintenance/${id}/oic/reject`, { comment }),
  
  // Supplier
  getApprovedForSupplier: () => axios.get('/maintenance/supplier/approved'),
  updateSupplyStatus: (id, status, comment) => 
    axios.put(`/maintenance/${id}/supplier/update`, { status, comment }),
};

// User APIs
export const userAPI = {
  getProfile: () => axios.get('/users/profile'),
  updateProfile: (data) => axios.put('/users/profile', data),
};

// Helper function to handle API errors
export const handleAPIError = (error) => {
  if (error.response) {
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    return 'No response from server';
  } else {
    return error.message || 'An error occurred';
  }
};