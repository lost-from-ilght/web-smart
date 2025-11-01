import axios from 'axios'
import type { Room, Device, User } from './types'

const API_URL = 'https://smart-home-2hdi.onrender.com/api'

export const api = {
  login: async (username: string, password: string) => {
    const { data } = await axios.post(`${API_URL}/auth/login`, { username, password })
    return data
  },
  getRooms: async (homeId: string) => {
    const { data } = await axios.get(`${API_URL}/room/${homeId}`)
    return data as Room[]
  },
  getRoomById: async (roomId: string) => {
    const { data } = await axios.get(`${API_URL}/room/find/${roomId}`)
    return data as Room
  },
  updateRoomCommand: async (roomId: string, command: Partial<Room['command']>) => {
    const { data } = await axios.post(`${API_URL}/commands/${roomId}`, command)
    return data
  },
  updateDivider: async (roomId: string, command: Partial<Room['command']>) => {
    const { data } = await axios.post(`${API_URL}/commands/divider/${roomId}`, command)
    return data
  },
  getDevices: async (homeId: string) => {
    const { data } = await axios.get(`${API_URL}/devices/${homeId}`)
    return data as Device[]
  },
  updateDevice: async (deviceId: string, status: boolean, value?: number) => {
    const { data } = await axios.put(`${API_URL}/devices/${deviceId}`, { status, value })
    return data
  },
  checkActivity: async (id: string) => {
    const { data } = await axios.get(`${API_URL}/activity/check/${id}`)
    return data
  },
  getDanger: async (id: string) => {
    const { data } = await axios.get(`${API_URL}/danger/${id}`)
    return data
  },
  updateDanger: async (id: string, payload: any) => {
    const { data } = await axios.put(`${API_URL}/danger/${id}`, payload)
    return data
  },
  updatePushToken: async (id: string, payload: any) => {
    const { data } = await axios.put(`${API_URL}/user/pushToken/${id}`, payload)
    return data
  },
  updateProfile: async (userId: string, name: string, email: string, phoneNumber: string) => {
    const { data } = await axios.put(`${API_URL}/user/${userId}`, { name, email, phone: phoneNumber })
    return data
  },
  updatePassword: async (userId: string, currentPassword: string, newPassword: string) => {
    const { data } = await axios.put(`${API_URL}/user/password/${userId}`, { currentPassword, newPassword })
    return data
  },
  getNotfications: async (homeId: string) => {
    const { data } = await axios.get(`${API_URL}/otifications/${homeId}`)
    return data
  },
  readNotfications: async (id: string) => {
    const { data } = await axios.get(`${API_URL}/otifications/read/${id}`)
    return data
  },
}



