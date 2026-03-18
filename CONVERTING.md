# Soundport SwiftUI 转 uniapp 转换指南

## 项目结构对比

### SwiftUI 原版
```
Soundport/
├── SoundportApp.swift          # App 入口
├── Views/
│   ├── ContentView.swift
│   ├── MainTabView.swift       # 主 Tab 视图
│   ├── RadioHomeView.swift     # 电台首页
│   └── TV/
│       ├── TVHomeView.swift
│       └── TVVideoPlayer.swift
├── ViewModels/
│   ├── RadioViewModel.swift    # 电台状态管理
│   ├── HomeViewModel.swift
│   └── TVViewModel.swift
├── Services/
│   ├── RadioService.swift      # API 服务
│   └── RadioCategorySerivce.swift
├── Manager/
│   ├── AudioPlayerManager.swift # 音频播放
│   ├── FavoritesManager.swift   # 收藏管理
│   └── SleepTimerManager.swift  # 定时关闭
└── Model/
    ├── Station.swift           # 数据模型
    └── TVChannel.swift
```

### uniapp 新版
```
soundport-uniapp/
├── src/
│   ├── main.ts                 # App 入口
│   ├── App.vue
│   ├── pages/
│   │   ├── index/index.vue     # 启动页
│   │   ├── radio/radio.vue     # 电台首页
│   │   ├── tv/tv.vue           # 电视页
│   │   ├── search/search.vue   # 搜索页
│   │   └── player/player.vue   # 播放详情页
│   ├── components/
│   │   ├── station-row/        # 电台列表项
│   │   └── mini-player/        # 迷你播放器
│   ├── store/
│   │   ├── radio.ts            # 电台状态 (对应 RadioViewModel)
│   │   ├── player.ts           # 播放器状态 (对应 AudioPlayerManager)
│   │   ├── favorites.ts        # 收藏状态 (对应 FavoritesManager)
│   │   └── weather.ts          # 天气状态
│   ├── services/
│   │   ├── radioService.ts     # API 服务 (对应 RadioService)
│   │   └── favoritesService.ts # 收藏服务
│   ├── types/
│   │   ├── station.ts          # 数据模型 (对应 Station.swift)
│   │   └── common.ts
│   └── utils/
│       ├── index.ts            # 工具函数
│       └── regionMapper.ts     # 地区映射
├── static/                     # 静态资源
├── pages.json                  # 页面配置
└── manifest.json               # 应用配置
```

## 组件映射表

| SwiftUI | uniapp | 说明 |
|---------|--------|------|
| `@StateObject` | `useRadioStore()` | 状态管理对象 |
| `@ObservedObject` | `computed()` / `storeToRefs()` | 响应式对象 |
| `@Published` | `ref()` / `reactive()` | 响应式属性 |
| `VStack` | `view + flex-direction: column` | 垂直布局 |
| `HStack` | `view + flex-direction: row` | 水平布局 |
| `ZStack` | `view + position: absolute` | 层叠布局 |
| `List` | `scroll-view` | 滚动列表 |
| `NavigationView` | 页面导航 | 页面栈导航 |
| `TabView` | `tabBar` | 底部标签栏 |
| `Button` | `button` / `view @tap` | 按钮 |
| `Image` | `image` | 图片 |
| `Text` | `text` | 文本 |
| `sheet` | 弹窗/遮罩 | 模态视图 |
| `NavigationLink` | `uni.navigateTo` | 页面跳转 |

## 功能映射

### 1. 数据模型 (Station.swift → types/station.ts)
```typescript
// Swift
struct Station: Identifiable, Hashable, Codable {
    let changeuuid: String
    let name: String
    // ...
}

// TypeScript
export interface Station {
  changeuuid: string
  name: string
  // ...
}
```

### 2. 状态管理 (RadioViewModel → store/radio.ts)
```swift
// Swift
@MainActor
class RadioViewModel: ObservableObject {
    @Published var stations: [Station] = []
    @Published var isLoading: Bool = false
    // ...
}
```

```typescript
// TypeScript
export const useRadioStore = defineStore('radio', () => {
  const stations = ref<Station[]>([])
  const isLoading = ref(false)
  // ...
})
```

### 3. API 服务 (RadioService → services/radioService.ts)
```swift
// Swift
func fetchChinaData() async throws -> [Region] {
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode([Region].self, from: data)
}
```

```typescript
// TypeScript
async fetchChinaData(): Promise<Region[]> {
  const res = await uni.request({ url, method: 'GET' })
  return res[1].data as Region[]
}
```

### 4. 音频播放 (AudioPlayerManager → store/player.ts)
```swift
// Swift - AVPlayer
func play(station: Station) {
    let playerItem = AVPlayerItem(url: url)
    player = AVPlayer(playerItem: playerItem)
    player?.play()
}
```

```typescript
// TypeScript - uni.createInnerAudioContext
function play(station: Station) {
  audioContext = uni.createInnerAudioContext()
  audioContext.src = station.streamUrl
  audioContext.play()
}
```

### 5. 本地存储 (UserDefaults → uni.setStorage)
```swift
// Swift
UserDefaults.standard.set(encoded, forKey: lastStationKey)
```

```typescript
// TypeScript
uni.setStorageSync('AppLastPlayedStation', JSON.stringify(station))
```

## 已实现功能

- ✅ 电台列表展示
- ✅ 分类浏览（收藏/热门/地区/国家台等）
- ✅ 省份/国家选择器
- ✅ 电台搜索
- ✅ 音频播放/暂停/切歌
- ✅ 收藏管理
- ✅ 迷你播放器
- ✅ 播放详情页
- ✅ 睡眠定时器
- ✅ Tab 导航

## 待实现功能

- ⏳ 天气信息显示（需配置天气 API）
- ⏳ TV 电视直播（IPTV M3U 解析）
- ⏳ 锁屏控制（需 App 端原生插件）
- ⏳ 后台播放（需 App 端配置）
- ⏳ SVG 图标支持

## 运行项目

```bash
cd /Users/mac1/Projects/soundport-uniapp

# 安装依赖
npm install

# 运行到 H5
npm run dev:h5

# 运行到微信小程序
npm run dev:mp-weixin

# 运行到 App（需要 HBuilderX）
npm run dev:app
```

## 下一步

1. **安装依赖**: `npm install`
2. **配置天气 API**: 在 `store/weather.ts` 中配置和风天气 API Key
3. **添加静态资源**: 在 `static/` 目录添加 logo 和 tabbar 图标
4. **测试运行**: 选择目标平台运行项目
5. **自定义样式**: 根据设计稿调整颜色和布局

## 注意事项

1. **API 跨域**: H5 开发时可能遇到跨域问题，建议使用 uni-app 代理或运行到小程序/App
2. **音频格式**: 部分电台流媒体格式可能需要特定解码器
3. **平台差异**: 小程序和 App 端能力不同，部分功能需要条件编译
4. **图片加载**: 建议使用 uni-app 的图片缓存方案优化加载
