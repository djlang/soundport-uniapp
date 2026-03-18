// 原始电台数据（API 返回）
export interface RawStation {
  changeuuid: string
  name: string
  url_resolved: string
  favicon: string
  tags: string
  state: string
  country: string
  tags?: string
  codec?: string
  bitrate?: number
  clickcount: number
}

// 天气数据
export interface WeatherData {
  location: string
  temperature: number
  condition: string
  icon: string
  humidity: number
  windSpeed: number
  updateTime: string
}

// 睡眠定时器配置
export interface SleepTimerConfig {
  enabled: boolean
  duration: number // 分钟
  remainingTime: number // 剩余秒数
}
