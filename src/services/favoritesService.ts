import type { Station } from '@/types/station'

/**
 * 收藏管理服务
 * 负责收藏的本地持久化
 */
class FavoritesService {
  private storageKey = 'soundport_favorites'

  /**
   * 获取收藏列表
   */
  getFavorites(): Station[] {
    try {
      const data = uni.getStorageSync(this.storageKey)
      if (!data) return []
      return JSON.parse(data) as Station[]
    } catch (error) {
      console.error('读取收藏失败:', error)
      return []
    }
  }

  /**
   * 保存收藏列表
   */
  saveFavorites(stations: Station[]): void {
    try {
      uni.setStorageSync(this.storageKey, JSON.stringify(stations))
      console.log('收藏已保存，总数:', stations.length)
    } catch (error) {
      console.error('保存收藏失败:', error)
    }
  }

  /**
   * 切换收藏状态
   */
  toggleFavorite(station: Station): Station[] {
    const favorites = this.getFavorites()
    const index = favorites.findIndex(s => s.changeuuid === station.changeuuid)

    if (index !== -1) {
      // 取消收藏
      favorites.splice(index, 1)
    } else {
      // 添加收藏
      favorites.push(station)
    }

    this.saveFavorites(favorites)
    return favorites
  }

  /**
   * 检查是否已收藏
   */
  isFavorite(station: Station): boolean {
    const favorites = this.getFavorites()
    return favorites.some(s => s.changeuuid === station.changeuuid)
  }

  /**
   * 清除所有收藏
   */
  clearFavorites(): void {
    uni.removeStorageSync(this.storageKey)
  }
}

export const favoritesService = new FavoritesService()
