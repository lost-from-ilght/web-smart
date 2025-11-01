export interface Device {
  id: string
  name: string
  type: string
  value: string | number | boolean
  isActive: boolean
}

export interface Command {
  id: string
  room_id: string
  mainLight: string
  sideLight: string
  ac: number
  charger: string
  music: string
  leftHeadLight: string
  rightHeadLight: string
  goldLight: string
  whiteLight: string
  tv: string
  frontSideLights: string
  backSideLights: string
  wallLights: string
  dangerFence: string
  storRoomLight: string
  door: string
  smartCurtain: string
  tempratureSensor: number
  gases: string
  smokes: string
  rainSensors: boolean
  motionDetector: boolean
  waterFlowSensor: number
  humidtySensor: number
  depthSensor: number
  soilmoistureSensor: number
  waterTanker: number
  divider: any
  plantWateringPump: string
  stove: string
  oven: string
  freezer: string
  fan: string
}

export interface Activity {
  id: string
  room_id: string
  mainLight: boolean
  sideLight: boolean
  ac: boolean
  charger: boolean
  music: boolean
  leftHeadLight: boolean
  rightHeadLight: boolean
  goldLight: boolean
  whiteLight: boolean
  tv: boolean
  frontSideLights: boolean
  backSideLights: boolean
  wallLights: boolean
  dangerFence: boolean
  storRoomLight: boolean
  door: boolean
  smartCurtain: boolean
  tempratureSensor: boolean
  gases: boolean
  smokes: boolean
  humiditySensor: boolean
  rainSensors: boolean
  motionDetector: boolean
  waterFlowSensor: boolean
  divider: boolean
  depthSensor: boolean
  soilmoistureSensor: boolean
  waterTanker: boolean
  plantWateringPump: boolean
}

export interface Room {
  id: string
  name: string
  home_id: string
  home: {
    id: string
    name: string
    address?: string
    is_active?: boolean
    createdAt: string
    updatedAt: string
  }
  switches: any[]
  onoffs: any[]
  acs: any[]
  musics: any[]
  tvs: any[]
  gases: any[]
  smokes: any[]
  command: Command
  activity: Activity
  divider?: any
  activities?: any
  createdAt: string
  updatedAt: string
  devices?: any[]
  temperature?: number
  humidity?: number
}

export interface User {
  id: string
  name: string
  email: string
  user: any
  pushToken: string
}



