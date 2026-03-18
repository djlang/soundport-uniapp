import type { Station, Region, RawStation, RadioCategoryType } from '@/types/station'
import type { RadioTaskType } from './radioTask'

/**
 * 电台服务类
 * 负责与 radio-browser.info API 交互
 */
class RadioService {
  // 使用分布式负载均衡域名
  private baseURL = 'https://all.api.radio-browser.info/json'

  /**
   * 获取中国区电台数据
   */
  async fetchChinaData(): Promise<Region[]> {
    try {
      const urlString = `${this.baseURL}/stations/bycountrycodeexact/CN?limit=500&order=clickcount&reverse=true`

      const res = await uni.request({
        url: urlString,
        method: 'GET',
        header: {
          'User-Agent': '声泊 Radio/1.0'
        }
      })

      if (res[1].statusCode !== 200) {
        console.error('请求失败:', res[1].statusCode)
        return []
      }

      const raw = res[1].data as RawStation[]

      // 打印所有州名用于调试
      const allStates = new Set(raw.map(r => r.state).filter(Boolean))
      console.log('API 返回的所有省份字段:', Array.from(allStates))

      const groupDict = new Map<string, Station[]>()

      for (const item of raw) {
        const name = item.name.toLowerCase()
        const state = (item.state || '').toLowerCase()

        let category = '其他'

        if (name.includes('gd') || name.includes('guangdong') ||
            name.includes('广东') || state.includes('guangdong') ||
            state.includes('广东') || state.includes('kwangtung')) {
          category = '广东'
        } else if (name.includes('cnr') || name.includes('中央') || name.includes('北京')) {
          category = '国家台'
        } else if (name.includes('上海') || name.includes('shanghai')) {
          category = '上海'
        } else if (item.state) {
          category = item.state
        }

        const station: Station = {
          changeuuid: item.changeuuid,
          id: item.changeuuid,
          name: item.name,
          frequency: item.tags?.split(',')[0] || '网络广播',
          logoUrl: item.favicon || '',
          streamUrl: item.url_resolved,
          tags: item.tags || '',
          state: item.state || ''
        }

        const list = groupDict.get(category) || []
        list.push(station)
        groupDict.set(category, list)
      }

      const regions: Region[] = Array.from(groupDict.entries()).map(([key, stations]) => ({
        id: key,
        name: key,
        stations
      }))

      return regions.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
    } catch (error) {
      console.error('获取中国区电台失败:', error)
      return []
    }
  }

  /**
   * 获取特定地区（如港澳台）数据
   */
  async fetchRegionData(code: string, regionName: string): Promise<Region> {
    try {
      const urlString = `${this.baseURL}/stations/bycountrycodeexact/${code}?limit=100`

      const res = await uni.request({
        url: urlString,
        method: 'GET',
        header: {
          'User-Agent': '声泊 Radio/1.0'
        }
      })

      if (res[1].statusCode !== 200) {
        throw new Error('请求失败')
      }

      const raw = res[1].data as RawStation[]

      const stations: Station[] = raw.map(item => ({
        changeuuid: item.changeuuid,
        id: item.changeuuid,
        name: item.name,
        frequency: regionName,
        logoUrl: item.favicon || '',
        streamUrl: item.url_resolved,
        tags: item.tags || '',
        state: item.state || ''
      }))

      return {
        id: code,
        name: regionName,
        stations
      }
    } catch (error) {
      console.error(`获取${regionName}数据失败:`, error)
      return { id: code, name: regionName, stations: [] }
    }
  }

  /**
   * 搜索电台
   */
  async searchStations(name: string, isGlobal = false): Promise<Station[]> {
    try {
      const cleanedName = name.trim()
      if (!cleanedName) return []

      const encodedName = encodeURIComponent(cleanedName)
      const countryParam = isGlobal ? '' : '&countrycode=CN'
      const urlString = `https://de1.api.radio-browser.info/json/stations/byname/${encodedName}${countryParam}&limit=50`

      const res = await uni.request({
        url: urlString,
        method: 'GET',
        header: {
          'User-Agent': '声泊 Radio/1.0'
        }
      })

      if (res[1].statusCode !== 200) {
        return []
      }

      const rawStations = res[1].data as RawStation[]

      return rawStations.map(raw => ({
        changeuuid: raw.changeuuid,
        id: raw.changeuuid,
        name: raw.name,
        frequency: raw.tags?.split(',')[0] || 'Internet',
        logoUrl: raw.favicon || '',
        streamUrl: raw.url_resolved,
        tags: raw.tags || '',
        state: raw.state || ''
      }))
    } catch (error) {
      console.error('搜索失败:', error)
      return []
    }
  }

  /**
   * 按热门标签获取
   */
  async getByTag(tag: string, limit = 50): Promise<Station[]> {
    try {
      const urlString = `${this.baseURL}/stations/bytag/${tag}?limit=${limit}`

      const res = await uni.request({
        url: urlString,
        method: 'GET',
        header: {
          'User-Agent': '声泊 Radio/1.0'
        }
      })

      if (res[1].statusCode !== 200) return []

      const rawStations = res[1].data as RawStation[]

      return rawStations.map(raw => ({
        changeuuid: raw.changeuuid,
        id: raw.changeuuid,
        name: raw.name,
        frequency: raw.tags?.split(',')[0] || 'Internet',
        logoUrl: raw.favicon || '',
        streamUrl: raw.url_resolved,
        tags: raw.tags || '',
        state: raw.state || ''
      }))
    } catch (error) {
      console.error(`获取标签${tag}失败:`, error)
      return []
    }
  }

  /**
   * 按热度获取
   */
  async getHot(limit = 50, offset = 0): Promise<Station[]> {
    try {
      const urlString = `${this.baseURL}/stations/topclick/?limit=${limit}&offset=${offset}`

      const res = await uni.request({
        url: urlString,
        method: 'GET',
        header: {
          'User-Agent': '声泊 Radio/1.0'
        }
      })

      if (res[1].statusCode !== 200) return []

      const rawStations = res[1].data as RawStation[]

      return rawStations.map(raw => ({
        changeuuid: raw.changeuuid,
        id: raw.changeuuid,
        name: raw.name,
        frequency: raw.tags?.split(',')[0] || 'Internet',
        logoUrl: raw.favicon || '',
        streamUrl: raw.url_resolved,
        tags: raw.tags || '',
        state: raw.state || ''
      }))
    } catch (error) {
      console.error('获取热门电台失败:', error)
      return []
    }
  }
}

export const radioService = new RadioService()
