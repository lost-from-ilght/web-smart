import axios from 'axios'
import type { Room, Device, User } from './types'

const API_URL = 'https://web-smart-backend.onrender.com/api'
export const DEFAULT_HOME_ID = 'd4a172af-579a-4cd8-80e3-1ec875ad71c1'

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
    const { data } = await axios.get(`${API_URL}/notifications/${homeId}`)
    return data
  },
 readNotfications: async (id: string) => {
    const { data } = await axios.get(`${API_URL}/notifications/read/${id}`)
    return data
  },
  updateSwitch: async (id: string, value: number, name?: string, description?: string) => {
    const { data } = await axios.put(`${API_URL}/switch/${id}`, { value, name, description })
    return data
  },
  updateOnOff: async (id: string, value: boolean, name?: string) => {
    const { data } = await axios.put(`${API_URL}/onoff/${id}`, { value, name })
    return data
  },
  updateAc: async (id: string, value: number, name?: string) => {
    const { data } = await axios.put(`${API_URL}/ac/${id}`, { value, name })
    return data
  },
  updateMusic: async (id: string, volume: number, playing: boolean, name?: string) => {
    const { data } = await axios.put(`${API_URL}/music/${id}`, { volume, playing, name })
    return data
  },
  updateTv: async (id: string, channel: number, volume: number, isOn: boolean, name?: string) => {
    const { data } = await axios.put(`${API_URL}/tv/${id}`, { channel, volume, isOn, name })
    return data
  },
}



