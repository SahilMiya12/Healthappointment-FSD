import api from './api'

export const appointmentService = {
  // Get user appointments
  async getUserAppointments() {
    try {
      const response = await api.get('/appointments/my')
      return response.data
    } catch (error) {
      console.error('Error fetching appointments:', error)
      throw error
    }
  },

  // Get appointment by ID - MAKE SURE THIS EXISTS
  async getAppointmentById(id) {
    try {
      console.log('Fetching appointment by ID:', id)
      const response = await api.get(`/appointments/${id}`)
      console.log('Get appointment response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching appointment:', error)
      throw error
    }
  },

  // Create new appointment
  async createAppointment(data) {
    try {
      console.log('Creating appointment:', data)
      const response = await api.post('/appointments', {
        doctorId: data.doctorId,
        appointmentDate: data.date,
        appointmentTime: data.time,
        type: data.type || 'consultation',
        reason: data.reason,
        symptoms: data.symptoms || []
      })
      return response.data
    } catch (error) {
      console.error('Error creating appointment:', error)
      throw error
    }
  },

  // Cancel appointment
  async cancelAppointment(id, reason) {
    try {
      const response = await api.put(`/appointments/${id}/cancel`, { reason })
      return response.data
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      throw error
    }
  },

  // Update appointment status
  async updateAppointmentStatus(id, status) {
    try {
      const response = await api.put(`/appointments/${id}/status`, { status })
      return response.data
    } catch (error) {
      console.error('Error updating appointment status:', error)
      throw error
    }
  },

  // Get available slots
  async getAvailableSlots(doctorId, date) {
    try {
      console.log(`Fetching slots for ${doctorId} on ${date}`)
      const response = await api.get(`/appointments/slots/${doctorId}?date=${date}`)
      return response.data
    } catch (error) {
      console.error('Error fetching slots:', error)
      throw error
    }
  }
}