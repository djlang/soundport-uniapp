<template>
  <view class="index-container">
    <view class="logo-wrapper">
      <image src="/static/logo.png" class="logo" mode="aspectFit" />
      <text class="app-name">声泊电台</text>
      <text class="app-desc">听见世界的美好</text>
    </view>

    <button class="enter-btn" @tap="enterApp">进入应用</button>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  // 检查是否有上次播放记录，有则直接进入电台页
  const lastStation = uni.getStorageSync('AppLastPlayedStation')
  if (lastStation) {
    uni.reLaunch({
      url: '/pages/radio/radio'
    })
  }
})

function enterApp() {
  uni.reLaunch({
    url: '/pages/radio/radio'
  })
}
</script>

<style lang="scss" scoped>
.index-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.logo-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 80px;
}

.logo {
  width: 120px;
  height: 120px;
}

.app-name {
  font-size: 28px;
  font-weight: 600;
  color: #fff;
}

.app-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.enter-btn {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 14px 60px;
  font-size: 16px;
}

.enter-btn::after {
  border: none;
}
</style>
