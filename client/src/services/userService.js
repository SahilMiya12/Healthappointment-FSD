import api from './api'

export const userService = {
  // Get all doctors
  async getAllDoctors() {
    try {
      const response = await api.get('/doctors')
      return response.data
    } catch (error) {
      console.error('Error fetching doctors:', error)
      throw error
    }
  },

  // Get doctor by ID
  async getDoctorById(id) {
    try {
      const response = await api.get(`/doctors/${id}`)
      return { doctor: response.data }
    } catch (error) {
      console.error('Error fetching doctor:', error)
      throw error
    }
  },

  // Get user profile
  async getUserProfile() {
    try {
      const response = await api.get('/auth/profile')
      return response.data
    } catch (error) {
      console.error('Error fetching profile:', error)
      throw error
    }
  },

  // Update user profile
  async updateUserProfile(data) {
    try {
      const response = await api.put('/auth/profile', data)
      return response.data
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  },

  // Get patients (admin/doctor only)
  async getPatients(params = {}) {
    try {
      const response = await api.get('/patients', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching patients:', error)
      throw error
    }
  },

  // Get patient by ID
  async getPatientById(id) {
    try {
      const response = await api.get(`/patients/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching patient:', error)
      throw error
    }
  },

  // Get doctor profile (for logged-in doctor)
  async getMyDoctorProfile() {
    try {
      const response = await api.get('/doctors/my/profile')
      return response.data
    } catch (error) {
      console.error('Error fetching doctor profile:', error)
      throw error
    }
  },

  // Update doctor availability
  async updateDoctorAvailability(availability) {
    try {
      const response = await api.put('/doctors/my/availability', { availability })
      return response.data
    } catch (error) {
      console.error('Error updating availability:', error)
      throw error
    }
  },

  // Get doctor availability
  async getDoctorAvailability() {
    try {
      const response = await api.get('/doctors/my/availability')
      return response.data
    } catch (error) {
      console.error('Error fetching availability:', error)
      throw error
    }
  }
}