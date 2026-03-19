import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Station, RadioCategoryType } from '@/types/station'
import { radioService } from '@/services/radioService'
import { favoritesService } from '@/services/favoritesService'
import { RegionMapper } from '@/utils/regionMapper'
import { filterDuplicates, buildRequestHeaders } from '@/utils'

const RADIO_CATEGORIES: RadioCategoryType[] = [
  'favorites',
  'hot',
  'region',
  'national',
  'traffic',
  'music',
  'news',
  'sports',
  'business',
  'culture',
  'country'
]

const CATEGORY_ICONS: Record<RadioCategoryType, string> = {
  favorites: 'heart-fill',
  hot: 'flame-fill',
  region: 'mappin-and-ellipse',
  national: 'antenna-radiowaves',
  traffic: 'car-fill',
  music: 'music-note',
  news: 'newspaper-fill',
  sports: 'figure-run',
  business: 'dollarsign',
  culture: 'lightbulb-fill',
  country: 'globe-americas'
}

const CATEGORY_LABELS: Record<RadioCategoryType, string> = {
  favorites: '收藏',
  hot: '热门',
  region: '地区',
  national: '国家台',
  traffic: '交通台',
  music: '音乐台',
  news: '新闻台',
  sports: '体育台',
  business: '经济',
  culture: '文化',
  country: '其他国家'
}

export const useRadioStore = defineStore('radio', () => {
  // 状态
  const selectedCategory = ref<RadioCategoryType>('favorites')
  const selectedProvince = ref<string>('广东')
  const selectedCountry = ref<string>('其他国家')
  const stations = ref<Station[]>([])
  const searchResults = ref<Station[]>([])
  const isLoading = ref(false)
  const isSearching = ref(false)
  const isFetchingMore = ref(false)
  const canLoadMore = ref(true)
  const loadError = ref(false)
  const searchText = ref('')

  // 分页
  const currentPage = ref(0)
  const pageSize = 10

  // 计算属性
  const categories = computed(() => {
    return RADIO_CATEGORIES.map(key => ({
      key,
      label: CATEGORY_LABELS[key],
      icon: CATEGORY_ICONS[key]
    }))
  })

  const isFavoritesCategory = computed(() => selectedCategory.value === 'favorites')

  // 方法
  async function selectCategory(category: RadioCategoryType) {
    selectedCategory.value = category
    currentPage.value = 0
    canLoadMore.value = true
    await loadData(false)
  }

  async function changeProvince(province: string) {
    selectedProvince.value = province
    uni.setStorageSync('AppLastSelectedProvince', province)
    await selectCategory('region')
  }

  async function changeCountry(country: string) {
    selectedCountry.value = country
    await selectCategory('country')
  }

  /**
   * 核心加载方法
   */
  async function loadData(isNextPage = false) {
    if (isLoading.value || isFetchingMore.value) return

    if (isNextPage) {
      if (!canLoadMore.value) return
      isFetchingMore.value = true
    } else {
      isLoading.value = true
      stations.value = []
      currentPage.value = 0
    }

    const offset = currentPage.value * pageSize

    try {
      let newStations: Station[] = []

      switch (selectedCategory.value) {
        case 'hot':
          newStations = await radioService.getHot(pageSize, offset)
          break

        case 'region': {
          const apiParam = RegionMapper.toApiParameter(selectedProvince.value)
          // 使用 bystate 接口
          const url = `https://all.api.radio-browser.info/json/stations/bystate/${encodeURIComponent(apiParam)}?limit=${pageSize}&offset=${offset}`
          const res: any = await uni.request({ url, method: 'GET', header: buildRequestHeaders() })
          const response = Array.isArray(res) ? res[1] : res
          if (response.statusCode === 200) {
            newStations = (response.data as any[]).map(raw => ({
              changeuuid: raw.changeuuid,
              id: raw.changeuuid,
              name: raw.name,
              frequency: raw.tags?.split(',')[0] || '网络广播',
              logoUrl: raw.favicon || '',
              streamUrl: raw.url_resolved,
              tags: raw.tags || '',
              state: raw.state || ''
            }))
          }
          break
        }

        case 'country': {
          const apiParam = RegionMapper.toApiParameterForCountry(selectedCountry.value)
          if (apiParam) {
            const url = `https://all.api.radio-browser.info/json/stations/bycountrycodeexact/${apiParam}?limit=${pageSize}&offset=${offset}`
            const res: any = await uni.request({ url, method: 'GET', header: buildRequestHeaders() })
            const response = Array.isArray(res) ? res[1] : res
            if (response.statusCode === 200) {
              newStations = (response.data as any[]).map(raw => ({
                changeuuid: raw.changeuuid,
                id: raw.changeuuid,
                name: raw.name,
                frequency: selectedCountry.value,
                logoUrl: raw.favicon || '',
                streamUrl: raw.url_resolved,
                tags: raw.tags || '',
                state: raw.state || ''
              }))
            }
          }
          break
        }

        case 'national': {
          const url = `https://all.api.radio-browser.info/json/stations/byname/中央?limit=${pageSize}&offset=${offset}`
          const res: any = await uni.request({ url, method: 'GET', header: buildRequestHeaders() })
          const response = Array.isArray(res) ? res[1] : res
          if (response.statusCode === 200) {
            newStations = (response.data as any[]).map(raw => ({
              changeuuid: raw.changeuuid,
              id: raw.changeuuid,
              name: raw.name,
              frequency: raw.tags?.split(',')[0] || '国家台',
              logoUrl: raw.favicon || '',
              streamUrl: raw.url_resolved,
              tags: raw.tags || '',
              state: raw.state || ''
            }))
          }
          break
        }

        case 'favorites': {
          const favs = favoritesService.getFavorites()
          stations.value = favs
          canLoadMore.value = false
          loadError.value = false
          isLoading.value = false
          isFetchingMore.value = false
          return
        }

        default: {
          // 音乐、交通、新闻等标签分类
          const tag = categoryToTag(selectedCategory.value)
          newStations = await radioService.getByTag(tag, pageSize)
          break
        }
      }

      const filtered = filterDuplicates(newStations, stations.value)

      if (isNextPage) {
        stations.value.push(...filtered)
      } else {
        stations.value = filtered
      }

      canLoadMore.value = newStations.length >= pageSize
      currentPage.value += 1
      loadError.value = false
    } catch (error) {
      console.error('加载失败:', error)
      loadError.value = true
    }

    isLoading.value = false
    isFetchingMore.value = false
  }

  function categoryToTag(category: RadioCategoryType): string {
    const tagMap: Record<RadioCategoryType, string> = {
      favorites: '',
      hot: '',
      region: '',
      country: '',
      national: '',
      traffic: 'traffic',
      music: 'music',
      news: 'news',
      sports: 'sports',
      business: 'economics',
      culture: 'culture'
    }
    return tagMap[category] || ''
  }

  /**
   * 搜索方法
   */
  async function performSearch(isNextPage = false) {
    if (isLoading.value || isFetchingMore.value) return

    const query = searchText.value.trim()
    if (!query) {
      searchResults.value = []
      isSearching.value = false
      return
    }

    if (isNextPage) {
      if (!canLoadMore.value) return
      isFetchingMore.value = true
    } else {
      isLoading.value = true
      isSearching.value = true
      searchResults.value = []
      currentPage.value = 0
    }

    try {
      const newStations = await radioService.searchStations(query)
      const filtered = filterDuplicates(newStations, searchResults.value)

      if (isNextPage) {
        searchResults.value.push(...filtered)
      } else {
        searchResults.value = filtered
      }

      canLoadMore.value = newStations.length >= pageSize
      currentPage.value += 1
      loadError.value = false
    } catch (error) {
      console.error('搜索失败:', error)
      loadError.value = true
      searchResults.value = []
    }

    isLoading.value = false
    isFetchingMore.value = false
    isSearching.value = false
  }

  // 初始化：恢复上次选择的省份
  function init() {
    const savedProvince = uni.getStorageSync('AppLastSelectedProvince')
    if (savedProvince) {
      selectedProvince.value = savedProvince
    }
  }

  return {
    // 状态
    selectedCategory,
    selectedProvince,
    selectedCountry,
    stations,
    searchResults,
    isLoading,
    isSearching,
    isFetchingMore,
    canLoadMore,
    loadError,
    searchText,
    // 计算属性
    categories,
    CATEGORY_ICONS,
    CATEGORY_LABELS,
    // 方法
    init,
    selectCategory,
    changeProvince,
    changeCountry,
    loadData,
    performSearch
  }
})
