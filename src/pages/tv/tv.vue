<template>
  <view class="tv-container">
    <view class="empty-state">
      <uni-icons type="tv" size="64" color="#eee" />
      <text class="title">电视直播</text>
      <text class="hint">功能开发中...</text>
      <text class="desc">即将支持 IPTV 电视频道播放</text>
    </view>
  </view>
</template>

<script setup lang="ts">
// TV 页面 - 待实现
</script>

<style lang="scss" scoped>
.tv-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 12px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.hint {
  font-size: 14px;
  color: #999;
}

.desc {
  font-size: 13px;
  color: #ccc;
}
</style>
