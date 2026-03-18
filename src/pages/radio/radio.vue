<template>
  <view class="radio-container">
    <!-- 左侧分类栏 -->
    <scroll-view class="category-sidebar" scroll-y>
      <view
        v-for="cat in radioStore.categories"
        :key="cat.key"
        class="category-item"
        :class="{ active: radioStore.selectedCategory === cat.key }"
        @tap="handleCategoryTap(cat.key)"
      >
        <uni-icons :type="getIconType(cat.icon)" size="20" :color="radioStore.selectedCategory === cat.key ? '#007AFF' : '#999'" />
        <text class="category-label">{{ cat.label }}</text>
      </view>

      <!-- 当前选中地区显示 -->
      <view v-if="radioStore.selectedCategory === 'region'" class="selected-region" @tap="showProvincePicker = true">
        <uni-icons type="mappin-and-ellipse" size="20" color="#007AFF" />
        <text class="region-name">{{ radioStore.selectedProvince }}</text>
        <uni-icons type="chevron-down" size="14" color="#999" />
      </view>

      <view v-else-if="radioStore.selectedCategory === 'country'" class="selected-region" @tap="showCountryPicker = true">
        <uni-icons type="globe-americas" size="20" color="#007AFF" />
        <text class="region-name">{{ radioStore.selectedCountry }}</text>
        <uni-icons type="chevron-down" size="14" color="#999" />
      </view>
    </scroll-view>

    <!-- 右侧内容区 -->
    <view class="content-area">
      <!-- 顶部搜索栏 -->
      <view class="search-header">
        <view class="search-box" @tap="goToSearch">
          <uni-icons type="search" size="18" color="#999" />
          <text class="search-placeholder">搜索电台</text>
        </view>
      </view>

      <!-- 电台列表 -->
      <scroll-view class="station-list" scroll-y @scrolltolower="loadMore">
        <!-- 收藏分类空状态 -->
        <view v-if="radioStore.isFavoritesCategory && radioStore.stations.length === 0" class="empty-state">
          <uni-icons type="heart" size="48" color="#ccc" />
          <text class="empty-text">暂无收藏</text>
          <text class="empty-hint">点击心形图标收藏喜欢的电台</text>
        </view>

        <!-- 加载错误 -->
        <view v-else-if="radioStore.loadError" class="error-state">
          <uni-icons type="info" size="48" color="#ccc" />
          <text class="error-text">加载失败</text>
          <button class="retry-btn" @tap="retryLoad">重试</button>
        </view>

        <!-- 电台列表 -->
        <view v-else>
          <station-row
            v-for="station in radioStore.stations"
            :key="station.changeuuid"
            :station="station"
            @tap="handleStationTap(station)"
          />
        </view>

        <!-- 加载更多 -->
        <view v-if="radioStore.isFetchingMore" class="loading-more">
          <uni-load-more status="loading" />
        </view>

        <view v-else-if="!radioStore.canLoadMore && radioStore.stations.length > 0" class="no-more">
          <text class="no-more-text">没有更多了</text>
        </view>
      </scroll-view>
    </view>

    <!-- 底部迷你播放器 -->
    <mini-player v-if="playerStore.currentStation" class="mini-player" />

    <!-- 省份选择器 -->
    <view v-if="showProvincePicker" class="picker-overlay" @tap="showProvincePicker = false">
      <view class="picker-content" @tap.stop>
        <view class="picker-header">
          <text class="picker-title">选择省份</text>
          <text class="picker-cancel" @tap="showProvincePicker = false">取消</text>
        </view>
        <scroll-view class="picker-list" scroll-y>
          <view
            v-for="province in regionList"
            :key="province"
            class="picker-item"
            :class="{ active: radioStore.selectedProvince === province }"
            @tap="handleProvinceSelect(province)"
          >
            {{ province }}
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 国家选择器 -->
    <view v-if="showCountryPicker" class="picker-overlay" @tap="showCountryPicker = false">
      <view class="picker-content" @tap.stop>
        <view class="picker-header">
          <text class="picker-title">选择国家</text>
          <text class="picker-cancel" @tap="showCountryPicker = false">取消</text>
        </view>
        <scroll-view class="picker-list" scroll-y>
          <view
            v-for="country in countryList"
            :key="country"
            class="picker-item"
            :class="{ active: radioStore.selectedCountry === country }"
            @tap="handleCountrySelect(country)"
          >
            {{ country }}
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRadioStore } from '@/store/radio'
import { usePlayerStore } from '@/store/player'
import { useFavoritesStore } from '@/store/favorites'
import StationRow from '@/components/station-row/index.vue'
import MiniPlayer from '@/components/mini-player/index.vue'

const radioStore = useRadioStore()
const playerStore = usePlayerStore()
const favoritesStore = useFavoritesStore()

const showProvincePicker = ref(false)
const showCountryPicker = ref(false)

// 省份列表
const regionList = ref([
  '北京', '上海', '广东', '江苏', '浙江', '福建', '四川', '湖北', '山东',
  '河南', '河北', '湖南', '安徽', '江西', '陕西', '山西', '重庆', '天津',
  '辽宁', '吉林', '黑龙江', '内蒙古', '广西', '海南', '贵州', '云南',
  '西藏', '甘肃', '青海', '宁夏', '新疆', '香港', '澳门'
])

// 国家列表
const countryList = ref([
  '美国', '英国', '日本', '韩国', '德国', '法国', '澳大利亚', '加拿大',
  '俄罗斯', '印度', '其他国家'
])

// 获取图标类型（映射到 uni-icons）
function getIconType(icon: string): string {
  const iconMap: Record<string, string> = {
    'heart-fill': 'heart',
    'flame-fill': 'fire',
    'mappin-and-ellipse': 'location',
    'antenna-radiowaves': 'radiowaves',
    'car-fill': 'car',
    'music-note': 'music',
    'newspaper-fill': 'news',
    'figure-run': 'run',
    'dollarsign': 'money',
    'lightbulb-fill': 'lightbulb',
    'globe-americas': ' globe'
  }
  return iconMap[icon] || 'circle'
}

// 处理分类点击
async function handleCategoryTap(category: string) {
  uni.showLoading({ title: '加载中...' })
  await radioStore.selectCategory(category as any)
  uni.hideLoading()
}

// 处理电台点击
function handleStationTap(station: any) {
  playerStore.play(station)
}

// 加载更多
async function loadMore() {
  if (!radioStore.canLoadMore || radioStore.isFetchingMore) return
  await radioStore.loadData(true)
}

// 重试加载
async function retryLoad() {
  uni.showLoading({ title: '加载中...' })
  await radioStore.loadData(false)
  uni.hideLoading()
}

// 选择省份
async function handleProvinceSelect(province: string) {
  showProvincePicker.value = false
  uni.showLoading({ title: '加载中...' })
  await radioStore.changeProvince(province)
  uni.hideLoading()
}

// 选择国家
async function handleCountrySelect(country: string) {
  showCountryPicker.value = false
  uni.showLoading({ title: '加载中...' })
  await radioStore.changeCountry(country)
  uni.hideLoading()
}

// 跳转到搜索页
function goToSearch() {
  uni.navigateTo({
    url: '/pages/search/search'
  })
}

// 初始化
onMounted(() => {
  radioStore.init()
  favoritesStore.init()
  playerStore.init()

  // 加载默认数据
  radioStore.loadData()
})
</script>

<style lang="scss" scoped>
.radio-container {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
}

.category-sidebar {
  width: 80px;
  background-color: #fff;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  gap: 4px;
}

.category-item.active {
  background-color: #f0f7ff;
}

.category-label {
  font-size: 12px;
  color: #666;
}

.selected-region {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  gap: 4px;
  border-top: 1px solid #eee;
}

.region-name {
  font-size: 12px;
  color: #007aff;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.search-header {
  padding: 12px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 20px;
  padding: 8px 16px;
  gap: 8px;
}

.search-placeholder {
  font-size: 14px;
  color: #999;
}

.station-list {
  flex: 1;
  overflow-y: auto;
}

.empty-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
}

.empty-text,
.error-text {
  font-size: 14px;
  color: #999;
}

.retry-btn {
  margin-top: 12px;
  background-color: #007aff;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 24px;
  font-size: 14px;
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

.mini-player {
  position: fixed;
  bottom: 0;
  left: 80px;
  right: 0;
  z-index: 100;
}

.picker-overlay {
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

.picker-content {
  width: 80%;
  max-height: 60%;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.picker-title {
  font-size: 16px;
  font-weight: 600;
}

.picker-cancel {
  font-size: 14px;
  color: #999;
}

.picker-list {
  max-height: 300px;
}

.picker-item {
  padding: 16px;
  font-size: 15px;
  border-bottom: 1px solid #f5f5f5;
}

.picker-item.active {
  color: #007aff;
  background-color: #f0f7ff;
}
</style>
