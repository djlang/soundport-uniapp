import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Station } from '@/types/station'
import { favoritesService } from '@/services/favoritesService'

export const useFavoritesStore = defineStore('favorites', () => {
  // 状态
  const favoriteStations = ref<Station[]>([])

  // 初始化
  function init() {
    loadFromDisk()
  }

  /**
   * 从本地加载
   */
  function loadFromDisk() {
    favoriteStations.value = favoritesService.getFavorites()
    console.log('已恢复收藏:', favoriteStations.value.length, '个')
  }

  /**
   * 切换收藏状态
   */
  function toggleFavorite(station: Station): boolean {
    const newList = favoritesService.toggleFavorite(station)
    favoriteStations.value = newList
    return favoritesService.isFavorite(station)
  }

  /**
   * 检查是否已收藏
   */
  function isFavorite(station: Station): boolean {
    return favoritesService.isFavorite(station)
  }

  /**
   * 移除收藏
   */
  function removeFavorite(station: Station) {
    const newList = favoriteStations.value.filter(s => s.changeuuid !== station.changeuuid)
    favoritesService.saveFavorites(newList)
    favoriteStations.value = newList
  }

  return {
    favoriteStations,
    init,
    loadFromDisk,
    toggleFavorite,
    isFavorite,
    removeFavorite
  }
})
