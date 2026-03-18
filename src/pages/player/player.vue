<template>
  <view class="player-container">
    <!-- 顶部导航栏 -->
    <view class="player-header">
      <text class="now-playing">正在播放</text>
    </view>

    <!-- 电台封面 -->
    <view class="album-art">
      <image
        v-if="currentStation?.logoUrl"
        :src="currentStation.logoUrl"
        mode="aspectFill"
        class="album-image"
      />
      <view v-else class="album-placeholder">
        <uni-icons type="radio" size="64" color="#999" />
      </view>
    </view>

    <!-- 电台信息 -->
    <view class="station-info">
      <text class="station-name">{{ currentStation?.name || '未知电台' }}</text>
      <text class="station-frequency">{{ currentStation?.frequency || '' }}</text>
    </view>

    <!-- 播放控制 -->
    <view class="controls">
      <button class="control-btn" @tap="previous">
        <uni-icons type="backward" size="32" color="#333" />
      </button>

      <button class="play-btn" @tap="togglePlay">
        <uni-icons :type="isPlaying ? 'pause' : 'play'" size="48" color="#fff" />
      </button>

      <button class="control-btn" @tap="next">
        <uni-icons type="forward" size="32" color="#333" />
      </button>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-actions">
      <button class="action-btn" @tap="toggleFavorite">
        <uni-icons :type="isFav ? 'heart' : 'heart'" size="24" :color="isFav ? '#ff3b30' : '#999'" />
        <text class="action-label">{{ isFav ? '已收藏' : '收藏' }}</text>
      </button>

      <button class="action-btn" @tap="showShare = true">
        <uni-icons type="share" size="24" color="#999" />
        <text class="action-label">分享</text>
      </button>

      <button class="action-btn" @tap="showSleepTimer = true">
        <uni-icons type="clock" size="24" color="#999" />
        <text class="action-label">定时</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePlayerStore } from '@/store/player'
import { useFavoritesStore } from '@/store/favorites'

const playerStore = usePlayerStore()
const favoritesStore = useFavoritesStore()

const currentStation = computed(() => playerStore.currentStation)
const isPlaying = computed(() => playerStore.isPlaying)
const isFav = computed(() => {
  if (!currentStation.value) return false
  return favoritesStore.isFavorite(currentStation.value)
})

const showShare = ref(false)
const showSleepTimer = ref(false)

function togglePlay() {
  playerStore.toggle()
}

function previous() {
  playerStore.previous()
}

function next() {
  playerStore.next()
}

function toggleFavorite() {
  if (currentStation.value) {
    favoritesStore.toggleFavorite(currentStation.value)
  }
}
</script>

<style lang="scss" scoped>
.player-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.player-header {
  margin-top: 40px;
}

.now-playing {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.album-art {
  margin-top: 40px;
  width: 240px;
  height: 240px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  overflow: hidden;
}

.album-image {
  width: 100%;
  height: 100%;
}

.album-placeholder {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.station-info {
  margin-top: 32px;
  text-align: center;
}

.station-name {
  display: block;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
}

.station-frequency {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  margin-top: 48px;
}

.control-btn,
.play-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
}

.control-btn::after,
.play-btn::after {
  border: none;
}

.play-btn {
  width: 80px;
  height: 80px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.bottom-actions {
  display: flex;
  gap: 40px;
  margin-top: 60px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
}

.action-btn::after {
  border: none;
}

.action-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}
</style>
