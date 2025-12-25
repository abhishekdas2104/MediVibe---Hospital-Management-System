import apiClient from './api';

export const authService = {
  login: (email, password) => 
    apiClient.post('/auth/login', { email, password }),
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  register: (userData) =>
    apiClient.post('/auth/register', userData),
  
  getMe: () =>
    apiClient.get('/auth/me'),
};

export const bedService = {
  getAllBeds: () =>
    apiClient.get('/beds'),
  
  getBedsByWard: (ward) =>
    apiClient.get(`/beds/ward/${ward}`),
  
  getBedAvailability: () =>
    apiClient.get('/beds/availability/summary'),
  
  updateBedStatus: (bedId, status) =>
    apiClient.put(`/beds/${bedId}/status`, { status }),
};

export const patientService = {
  getAllPatients: () =>
    apiClient.get('/patients'),
  
  getPatientById: (id) =>
    apiClient.get(`/patients/${id}`),
  
  admitPatient: (patientData) =>
    apiClient.post('/patients/admit', patientData),
  
  dischargePatient: (patientId) =>
    apiClient.put(`/patients/${patientId}/discharge`),
  
  updatePatient: (patientId, data) =>
    apiClient.put(`/patients/${patientId}`, data),
};

export const wardService = {
  getAllWards: () =>
    apiClient.get('/wards'),
  
  getWardById: (id) =>
    apiClient.get(`/wards/${id}`),
  
  getWardStatistics: () =>
    apiClient.get('/wards/statistics/all'),
};

export const reportService = {
  getBedUtilizationReport: (params) =>
    apiClient.get('/reports/bed-utilization', { params }),
  
  getAdmissionDischargeReport: (params) =>
    apiClient.get('/reports/admission-discharge', { params }),
  
  getWardAnalytics: (params) =>
    apiClient.get('/reports/ward-analytics', { params }),
};

export const adminService = {
  // Users
  listUsers: () => apiClient.get('/admin/users'),
  createUser: (payload) => apiClient.post('/admin/users', payload),
  updateUserStatus: (id, isActive) => apiClient.patch(`/admin/users/${id}/status`, { isActive }),

  // Beds
  listBeds: () => apiClient.get('/admin/beds'),
  createBed: (payload) => apiClient.post('/admin/beds', payload),
  updateBedStatus: (id, status) => apiClient.patch(`/admin/beds/${id}/status`, { status }),

  // Reports
  getReportSummary: () => apiClient.get('/admin/reports/summary'),
  generateReport: (type = 'occupancy') => apiClient.post('/admin/reports/generate', { type }),

  // Patients & assignments
  listPatients: () => apiClient.get('/admin/patients'),
  assignPatient: (payload) => apiClient.post('/admin/assignments', payload),
  dischargePatient: (patientId) => apiClient.patch(`/admin/patients/${patientId}/discharge`),
};

export const doctorService = {
  getDuties: () => apiClient.get('/doctor/duties'),
  updateDutyStatus: (dutyId, status) => apiClient.patch(`/doctor/duties/${dutyId}/status`, { status }),
  getPatients: () => apiClient.get('/doctor/patients'),
  getPatientDetails: (id) => apiClient.get(`/doctor/patients/${id}`),
  markVisited: (patientId) => apiClient.post(`/doctor/patients/${patientId}/visit`),
  updateNotes: (assignmentId, notes) => apiClient.patch(`/doctor/assignments/${assignmentId}/notes`, { notes }),
  getBedAvailability: () => apiClient.get('/doctor/beds/availability'),
};

export const nurseService = {
  getDuties: () => apiClient.get('/nurse/duties'),
  updateDutyStatus: (dutyId, status) => apiClient.patch(`/nurse/duties/${dutyId}/status`, { status }),
  getPatients: () => apiClient.get('/nurse/patients'),
  getPatientDetails: (id) => apiClient.get(`/nurse/patients/${id}`),
  markVisited: (patientId) => apiClient.post(`/nurse/patients/${patientId}/visit`),
  addCareNote: (assignmentId, note, vitals) => apiClient.post(`/nurse/assignments/${assignmentId}/care-notes`, { note, vitals }),
  updateBedStatus: (bedId, status) => apiClient.patch(`/nurse/beds/${bedId}/status`, { status }),
};

export const receptionistService = {
  admitPatient: (payload) => apiClient.post('/receptionist/patients/admit', payload),
  getPatients: () => apiClient.get('/receptionist/patients'),
  dischargePatient: (id) => apiClient.patch(`/receptionist/patients/${id}/discharge`),
  getBedAvailability: () => apiClient.get('/receptionist/beds/availability'),
};
