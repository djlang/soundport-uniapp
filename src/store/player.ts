import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Station, Region } from '@/types/station'
import { favoritesService } from '@/services/favoritesService'

export const usePlayerStore = defineStore('player', () => {
  // 状态
  const currentStation = ref<Station | null>(null)
  const isPlaying = ref(false)
  const isBuffering = ref(false)
  const allRegions = ref<Region[]>([])

  // 播放器实例（只在 App 端有效）
  let audioContext: UniApp.InnerAudioContext | null = null

  // 计算属性
  const isFavoritesCategory = computed(() => {
    return allRegions.value.length === 1 && allRegions.value[0].id === 'fav'
  })

  // 扁平化电台列表
  const flatStations = computed(() => {
    return allRegions.value.flatMap(region => region.stations)
  })

  // 初始化
  function init() {
    // #ifdef APP-PLUS || H5
    audioContext = uni.createInnerAudioContext()

    audioContext.onError((res) => {
      console.error('播放失败:', res)
      isBuffering.value = false
      isPlaying.value = false
    })

    audioContext.onPlay(() => {
      console.log('开始播放')
      isBuffering.value = false
      isPlaying.value = true
    })

    audioContext.onPause(() => {
      console.log('暂停播放')
      isPlaying.value = false
    })

    audioContext.onStop(() => {
      console.log('停止播放')
      isPlaying.value = false
    })

    audioContext.onEnded(() => {
      console.log('播放结束')
      isPlaying.value = false
    })

    audioContext.onWaiting(() => {
      console.log('缓冲中')
      isBuffering.value = true
    })

    audioContext.onCanplay(() => {
      console.log('可以播放')
      isBuffering.value = false
    })
    // #endif

    // 恢复上次播放的电台（只恢复状态，不自动播放）
    restoreLastStation()
  }

  /**
   * 播放电台
   */
  function play(station: Station) {
    // 如果是当前电台，切换播放/暂停
    if (currentStation.value?.changeuuid === station.changeuuid) {
      toggle()
      return
    }

    currentStation.value = station

    // 保存到最后播放记录
    saveLastStation(station)

    // #ifdef APP-PLUS || H5
    if (audioContext) {
      audioContext.stop()
      audioContext.src = station.streamUrl
      audioContext.play()
      isBuffering.value = true
    }
    // #endif

    // #ifdef MP-WEIXIN
    // 小程序端需要特殊处理
    if (audioContext) {
      audioContext.stop()
      audioContext.src = station.streamUrl
      audioContext.play()
      isBuffering.value = true
    }
    // #endif

    // 更新锁屏信息（App 端）
    // #ifdef APP-PLUS
    updateLockScreenInfo(station)
    // #endif
  }

  /**
   * 切换播放/暂停
   */
  function toggle() {
    // #ifdef APP-PLUS || H5
    if (audioContext) {
      if (isPlaying.value) {
        audioContext.pause()
      } else {
        audioContext.play()
      }
    }
    // #endif

    // #ifndef APP-PLUS || H5
    // 其他平台模拟状态切换
    isPlaying.value = !isPlaying.value
    // #endif
  }

  /**
   * 停止播放
   */
  function stop() {
    // #ifdef APP-PLUS || H5
    if (audioContext) {
      audioContext.pause()
    }
    // #endif
    isPlaying.value = false
  }

  /**
   * 下一首
   */
  function next() {
    const stations = flatStations.value
    if (stations.length === 0) return

    const currentIndex = stations.findIndex(s => s.changeuuid === currentStation.value?.changeuuid)
    if (currentIndex === -1) {
      if (stations.length > 0) play(stations[0])
      return
    }

    const nextIndex = (currentIndex + 1) % stations.length
    play(stations[nextIndex])
  }

  /**
   * 上一首
   */
  function previous() {
    const stations = flatStations.value
    if (stations.length === 0) return

    const currentIndex = stations.findIndex(s => s.changeuuid === currentStation.value?.changeuuid)
    if (currentIndex === -1) {
      if (stations.length > 0) play(stations[stations.length - 1])
      return
    }

    const prevIndex = (currentIndex - 1 + stations.length) % stations.length
    play(stations[prevIndex])
  }

  /**
   * 保存最后播放记录
   */
  function saveLastStation(station: Station) {
    try {
      uni.setStorageSync('AppLastPlayedStation', JSON.stringify(station))
    } catch (error) {
      console.error('保存播放记录失败:', error)
    }
  }

  /**
   * 恢复最后播放记录
   */
  function restoreLastStation() {
    try {
      const data = uni.getStorageSync('AppLastPlayedStation')
      if (data) {
        currentStation.value = JSON.parse(data) as Station
      }
    } catch (error) {
      console.error('恢复播放记录失败:', error)
    }
  }

  /**
   * 更新锁屏信息（仅 App 端）
   */
  function updateLockScreenInfo(station: Station) {
    // #ifdef APP-PLUS
    // 这里需要使用原生插件来更新锁屏信息
    // 简单版本可以先不实现
    console.log('更新锁屏信息:', station.name)
    // #endif
  }

  /**
   * 设置定时关闭
   */
  function setSleepTimer(minutes: number, callback?: () => void) {
    const milliseconds = minutes * 60 * 1000

    setTimeout(() => {
      stop()
      if (callback) callback()
      uni.showToast({
        title: '定时关闭已生效',
        icon: 'none'
      })
    }, milliseconds)
  }

  // 清理
  function dispose() {
    // #ifdef APP-PLUS || H5
    if (audioContext) {
      audioContext.destroy()
      audioContext = null
    }
    // #endif
  }

  return {
    // 状态
    currentStation,
    isPlaying,
    isBuffering,
    allRegions,
    // 计算属性
    flatStations,
    isFavoritesCategory,
    // 方法
    init,
    play,
    toggle,
    stop,
    next,
    previous,
    dispose,
    setSleepTimer
  }
})
