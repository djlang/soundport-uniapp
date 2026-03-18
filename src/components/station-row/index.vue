<template>
  <view class="station-row" @tap="handleTap">
    <view class="station-logo">
      <image
        v-if="station.logoUrl"
        :src="station.logoUrl || '/static/default-logo.png'"
        mode="aspectFill"
        class="logo-image"
        lazy-load
      />
      <view v-else class="logo-placeholder">
        <uni-icons type="radio" size="24" color="#999" />
      </view>

      <!-- 播放中动画 -->
      <view v-if="isPlaying" class="playing-indicator">
        <view class="bar bar-1"></view>
        <view class="bar bar-2"></view>
        <view class="bar bar-3"></view>
      </view>
    </view>

    <view class="station-info">
      <text class="station-name">{{ station.name }}</text>
      <text class="station-frequency">{{ station.frequency }}</text>
    </view>

    <view class="station-action">
      <button class="fav-btn" @tap.stop="toggleFavorite">
        <uni-icons :type="isFav ? 'heart' : 'heart'" size="18" :color="isFav ? '#ff3b30' : '#ccc'" />
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Station } from '@/types/station'
import { usePlayerStore } from '@/store/player'
import { useFavoritesStore } from '@/store/favorites'

const props = defineProps<{
  station: Station
}>()

const emit = defineEmits<{
  (e: 'tap', station: Station): void
}>()

const playerStore = usePlayerStore()
const favoritesStore = useFavoritesStore()

const isPlaying = computed(() => {
  return playerStore.currentStation?.changeuuid === props.station.changeuuid && playerStore.isPlaying
})

const isFav = computed(() => {
  return favoritesStore.isFavorite(props.station)
})

function handleTap() {
  emit('tap', props.station)
}

function toggleFavorite() {
  // 震动反馈
  // #ifdef APP-PLUS
  uni.vibrateShort({ success: () => {} })
  // #endif

  favoritesStore.toggleFavorite(props.station)
}
</script>

<style lang="scss" scoped>
.station-row {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #fff;
  border-bottom: 1px solid #f5f5f5;
}

.station-logo {
  position: relative;
  width: 50px;
  height: 50px;
  margin-right: 12px;
}

.logo-image {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.playing-indicator {
  position: absolute;
  bottom: -4px;
  right: -4px;
  display: flex;
  align-items: flex-end;
  gap: 2px;
  padding: 4px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
}

.bar {
  width: 3px;
  background: linear-gradient(to top, #ff6b9d, #ffb347);
  border-radius: 2px;
  animation: equalize 0.8s ease-in-out infinite;
}

.bar-1 {
  height: 12px;
  animation-delay: 0s;
}

.bar-2 {
  height: 16px;
  animation-delay: 0.2s;
}

.bar-3 {
  height: 10px;
  animation-delay: 0.4s;
}

@keyframes equalize {
  0%, 100% {
    transform: scaleY(0.5);
  }
  50% {
    transform: scaleY(1);
  }
}

.station-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.station-name {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.station-frequency {
  font-size: 12px;
  color: #999;
}

.station-action {
  margin-left: 12px;
}

.fav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
}

.fav-btn::after {
  border: none;
}
</style>
