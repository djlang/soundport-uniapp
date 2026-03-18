<template>
  <view class="mini-player" @tap="goToPlayer">
    <!-- 进度条（可选） -->
    <view class="progress-bar">
      <view class="progress-inner" :style="{ width: progressWidth + '%' }"></view>
    </view>

    <view class="player-content">
      <!-- 电台 Logo -->
      <view class="station-logo">
        <image
          v-if="currentStation?.logoUrl"
          :src="currentStation.logoUrl"
          mode="aspectFill"
          class="logo-image"
        />
        <view v-else class="logo-placeholder">
          <uni-icons type="radio" size="24" color="#999" />
        </view>
      </view>

      <!-- 电台信息 -->
      <view class="station-info">
        <text class="station-name">{{ currentStation?.name || '' }}</text>
        <text class="station-frequency">{{ currentStation?.frequency || '' }}</text>
      </view>

      <!-- 控制按钮 -->
      <view class="player-controls">
        <button class="control-btn" @tap.stop="prev">
          <uni-icons type="backward" size="24" color="#fff" />
        </button>

        <button class="play-btn" @tap.stop="togglePlay">
          <uni-icons :type="isPlaying ? 'pause' : 'play'" size="28" color="#fff" />
        </button>

        <button class="control-btn" @tap.stop="next">
          <uni-icons type="forward" size="24" color="#fff" />
        </button>
      </view>

      <!-- 定时关闭按钮 -->
      <view class="sleep-timer-btn" @tap.stop="showSleepTimer = true">
        <uni-icons type="clock" size="20" color="#fff" />
      </view>
    </view>

    <!-- 睡眠定时器弹窗 -->
    <view v-if="showSleepTimer" class="timer-overlay" @tap="showSleepTimer = false">
      <view class="timer-content" @tap.stop>
        <view class="timer-header">
          <text class="timer-title">定时关闭</text>
          <text class="timer-close" @tap="showSleepTimer = false">✕</text>
        </view>

        <view class="timer-options">
          <view
            v-for="item in timerOptions"
            :key="item.minutes"
            class="timer-option"
            :class="{ active: selectedTimer === item.minutes }"
            @tap="selectTimer(item.minutes)"
          >
            {{ item.label }}
          </view>
        </view>

        <view v-if="timerCountdown > 0" class="timer-countdown">
          <text>剩余：{{ formatTime(timerCountdown) }}</text>
          <button class="cancel-timer-btn" @tap="cancelTimer">取消定时</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '@/store/player'

const playerStore = usePlayerStore()

const currentStation = computed(() => playerStore.currentStation)
const isPlaying = computed(() => playerStore.isPlaying)
const isBuffering = computed(() => playerStore.isBuffering)

const showSleepTimer = ref(false)
const selectedTimer = ref<number | null>(null)
const timerCountdown = ref(0)
let countdownInterval: any = null

const timerOptions = [
  { minutes: 15, label: '15 分钟' },
  { minutes: 30, label: '30 分钟' },
  { minutes: 45, label: '45 分钟' },
  { minutes: 60, label: '1 小时' },
  { minutes: 90, label: '1.5 小时' }
]

const progressWidth = ref(30)

// 模拟进度条（实际可以根据播放进度更新）
onMounted(() => {
  const interval = setInterval(() => {
    if (isPlaying.value) {
      progressWidth.value = Math.min(progressWidth.value + 1, 100)
    }
  }, 1000)

  onUnmounted(() => {
    clearInterval(interval)
  })
})

function goToPlayer() {
  uni.navigateTo({
    url: '/pages/player/player'
  })
}

function togglePlay() {
  if (isBuffering.value) return
  playerStore.toggle()
}

function prev() {
  playerStore.previous()
}

function next() {
  playerStore.next()
}

function selectTimer(minutes: number) {
  selectedTimer.value = minutes
  timerCountdown.value = minutes * 60

  playerStore.setSleepTimer(minutes, () => {
    timerCountdown.value = 0
    selectedTimer.value = null
    showSleepTimer.value = false
  })

  // 开始倒计时
  if (countdownInterval) clearInterval(countdownInterval)
  countdownInterval = setInterval(() => {
    if (timerCountdown.value > 0) {
      timerCountdown.value--
    } else {
      clearInterval(countdownInterval)
    }
  }, 1000)
}

function cancelTimer() {
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
  timerCountdown.value = 0
  selectedTimer.value = null
  uni.showToast({
    title: '已取消定时',
    icon: 'none'
  })
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}分${secs}秒`
}
</script>

<style lang="scss" scoped>
.mini-player {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-top: 6px;
}

.progress-bar {
  height: 2px;
  background-color: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.progress-inner {
  height: 100%;
  background-color: #fff;
  transition: width 0.3s ease;
}

.player-content {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
}

.station-logo {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
}

.logo-image {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.station-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  overflow: hidden;
}

.station-name {
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.station-frequency {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.player-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.control-btn,
.play-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
}

.control-btn::after,
.play-btn::after {
  border: none;
}

.play-btn {
  width: 44px;
  height: 44px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.sleep-timer-btn {
  padding: 8px;
}

.timer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.timer-content {
  width: 80%;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.timer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.timer-title {
  font-size: 16px;
  font-weight: 600;
}

.timer-close {
  font-size: 20px;
  color: #999;
}

.timer-options {
  display: flex;
  flex-wrap: wrap;
  padding: 16px;
  gap: 12px;
}

.timer-option {
  flex: 0 0 calc(33.33% - 8px);
  padding: 12px;
  text-align: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  font-size: 14px;
}

.timer-option.active {
  background-color: #667eea;
  color: #fff;
}

.timer-countdown {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-top: 1px solid #eee;
}

.cancel-timer-btn {
  background-color: #ff3b30;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 13px;
}

.cancel-timer-btn::after {
  border: none;
}
</style>
