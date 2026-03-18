import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { WeatherData } from '@/types/common'

export const useWeatherStore = defineStore('weather', () => {
  // 状态
  const weatherData = ref<WeatherData | null>(null)
  const isLoading = ref(false)
  const location = ref<string>('')

  // 天气图标映射
  const weatherIcons: Record<string, string> = {
    clear: 'sun-max',
    cloudy: 'cloud',
    rain: 'cloud-rain',
    snow: 'snowflake',
    thunderstorm: 'cloud-lightning',
    fog: 'cloud-fog',
    default: 'cloud'
  }

  /**
   * 获取天气数据
   * 注意：需要配置天气 API（这里使用和风天气或高德天气 API）
   */
  async function fetchWeather(cityCode: string) {
    isLoading.value = true
    try {
      // 这里需要替换为实际的天气 API
      // 示例：和风天气 API
      // const key = 'your-api-key'
      // const url = `https://devapi.qweather.com/v7/weather/now?location=${cityCode}&key=${key}`

      // 临时模拟数据
      await new Promise(resolve => setTimeout(resolve, 500))

      weatherData.value = {
        location: location.value || '未知',
        temperature: 25,
        condition: '晴',
        icon: 'sun-max',
        humidity: 60,
        windSpeed: 10,
        updateTime: new Date().toLocaleTimeString()
      }
    } catch (error) {
      console.error('获取天气失败:', error)
      uni.showToast({
        title: '获取天气失败',
        icon: 'none'
      })
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 根据定位获取城市代码并获取天气
   */
  async function fetchWeatherByLocation() {
    // #ifdef APP-PLUS || H5
    uni.getLocation({
      type: 'wgs84',
      success: (res) => {
        console.log('定位成功:', res.latitude, res.longitude)
        // 这里需要调用逆地理编码 API 获取城市
        // 然后调用 fetchWeather 获取天气
        location.value = '当前位置'
        fetchWeather('101280601') // 示例：广州
      },
      fail: () => {
        console.log('定位失败')
        location.value = '未知'
      }
    })
    // #endif

    // #ifdef MP-WEIXIN
    // 小程序定位
    uni.getLocation({
      type: 'wgs84',
      success: (res) => {
        location.value = '当前位置'
        // 需要使用小程序的天气 API 或云函数
      }
    })
    // #endif
  }

  return {
    weatherData,
    isLoading,
    location,
    weatherIcons,
    fetchWeather,
    fetchWeatherByLocation
  }
})
