<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('App Launch')
  // 初始化全局状态
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
/*每个页面公共 css */
@import './uni.scss';

page {
  height: 100%;
  background-color: #f5f5f5;
}
</style>
