# 声泊电台 - uniapp 跨端版

基于 uniapp + Vue3 + TypeScript 开发的跨平台网络收音机应用

## 功能特性

- 📻 在线电台播放
- 🗂️ 分类浏览（收藏/热门/地区/国家台等）
- 🌍 地区选择（中国各省份及港澳台）
- 🔍 搜索功能
- ❤️ 收藏管理
- ▶️ 音频播放控制
- 🌤️ 天气信息
- ⏱️ 定时关闭
- 📺 IPTV 电视

## 技术栈

- **框架**: uniapp 3.x + Vue 3.4
- **语言**: TypeScript 5.x
- **状态管理**: Pinia
- **构建工具**: Vite 5.x
- **样式**: SCSS

## 开发

```bash
# 安装依赖
npm install

# 运行到 H5
npm run dev:h5

# 运行到微信小程序
npm run dev:mp-weixin

# 运行到 App（需要 HBuilderX）
npm run dev:app

# 构建生产版本
npm run build:h5
npm run build:mp-weixin
npm run build:app
```

## 项目结构

```
soundport-uniapp/
├── src/
│   ├── main.ts              # 入口文件
│   ├── App.vue              # 根组件
│   ├── uni.scss             # 全局样式
│   ├── pages/               # 页面
│   │   ├── index/           # 首页
│   │   ├── radio/           # 电台页
│   │   ├── tv/              # 电视页
│   │   ├── search/          # 搜索页
│   │   └── player/          # 播放页
│   ├── components/          # 组件
│   ├── store/               # Pinia 状态管理
│   ├── services/            # API 服务
│   ├── types/               # TypeScript 类型定义
│   └── utils/               # 工具函数
├── static/                  # 静态资源
├── pages.json               # 页面配置
├── manifest.json            # 应用配置
└── package.json
```

## API 来源

电台数据来自 [radio-browser.info](https://www.radio-browser.info/)

## 平台支持

- [x] H5
- [ ] 微信小程序
- [ ] App (iOS/Android)
- [ ] 支付宝小程序
- [ ] 百度小程序

## 与 SwiftUI 版本对比

| 功能 | SwiftUI | uniapp |
|------|---------|--------|
| 数据模型 | Swift Struct | TypeScript Interface |
| 状态管理 | @StateObject/@Published | Pinia |
| 网络请求 | URLSession | uni.request |
| 音频播放 | AVPlayer | uni.createInnerAudioContext |
| 本地存储 | UserDefaults | uni.setStorage |
| 图片缓存 | SDWebImage | uni.getImageInfo |
