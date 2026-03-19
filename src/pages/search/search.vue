<template>
  <view class="search-container">
    <!-- 搜索框 -->
    <view class="search-header">
      <view class="search-input-box">
        <uni-icons type="search" size="18" color="#999" />
        <input
          v-model="radioStore.searchText"
          class="search-input"
          placeholder="搜索电台名称"
          placeholder-class="input-placeholder"
          confirm-type="search"
          @confirm="handleSearch"
        />
        <text v-if="radioStore.searchText" class="clear-btn" @tap="clearSearch">✕</text>
      </view>
      <button class="search-btn" @tap="handleSearch">搜索</button>
    </view>

    <!-- 搜索结果 -->
    <scroll-view class="search-results" scroll-y @scrolltolower="loadMore">
      <!-- 空状态 -->
      <view v-if="!radioStore.isSearching && radioStore.searchResults.length === 0 && !searched" class="empty-state">
        <uni-icons type="search" size="64" color="#eee" />
        <text class="empty-text">搜索电台</text>
        <text class="empty-hint">输入电台名称进行搜索</text>
      </view>

      <!-- 加载中 -->
      <view v-else-if="radioStore.isSearching" class="loading-state">
        <uni-load-more status="loading" />
      </view>

      <!-- 搜索结果为空 -->
      <view v-else-if="searched && radioStore.searchResults.length === 0" class="empty-state">
        <uni-icons type="info" size="64" color="#eee" />
        <text class="empty-text">未找到相关电台</text>
        <text class="empty-hint">试试其他关键词</text>
      </view>

      <!-- 结果列表 -->
      <view v-else>
        <station-row
          v-for="station in radioStore.searchResults"
          :key="station.changeuuid"
          :station="station"
          @tap="handleStationTap"
        />
      </view>

      <!-- 加载更多 -->
      <view v-if="radioStore.isFetchingMore" class="loading-more">
        <uni-load-more status="loading" />
      </view>

      <view v-else-if="!radioStore.canLoadMore && radioStore.searchResults.length > 0" class="no-more">
        <text class="no-more-text">没有更多了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRadioStore } from '@/store/radio'
import { usePlayerStore } from '@/store/player'
import StationRow from '@/components/station-row/index.vue'

const radioStore = useRadioStore()
const playerStore = usePlayerStore()

const searched = ref(false)

function handleSearch() {
  if (!radioStore.searchText.trim()) return
  searched.value = true
  radioStore.performSearch()
}

function clearSearch() {
  radioStore.searchText = ''
  searched.value = false
  radioStore.isSearching = false
  radioStore.searchResults = []
}

function handleStationTap(station: any) {
  playerStore.play(station)
}

async function loadMore() {
  if (!radioStore.canLoadMore || radioStore.isFetchingMore) return
  await radioStore.performSearch(true)
}
</script>

<style lang="scss" scoped>
.search-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.search-header {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #fff;
  gap: 12px;
}

.search-input-box {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 20px;
  padding: 8px 16px;
  gap: 8px;
}

.search-input {
  flex: 1;
  font-size: 14px;
  background: transparent;
}

.input-placeholder {
  color: #999;
}

.clear-btn {
  font-size: 16px;
  color: #999;
  padding: 4px;
}

.search-btn {
  background-color: #007aff;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 6px 20px;
  font-size: 14px;
}

.search-btn::after {
  border: none;
}

.search-results {
  height: calc(100vh - 70px);
}

.empty-state,
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 12px;
}

.empty-text {
  font-size: 15px;
  color: #999;
}

.empty-hint {
  font-size: 13px;
  color: #ccc;
}

.loading-more,
.no-more {
  padding: 16px;
  text-align: center;
}

.no-more-text {
  font-size: 12px;
  color: #999;
}
</style>
