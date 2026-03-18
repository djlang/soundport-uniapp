// 电台模型
export interface Station {
  changeuuid: string
  id: string
  name: string
  frequency: string
  logoUrl: string
  streamUrl: string
  tags: string
  state: string
}

// 地区模型，包含该地区下的电台列表
export interface Region {
  id: string
  name: string
  stations: Station[]
}

// 电台分类
export type RadioCategoryType =
  | 'favorites'
  | 'hot'
  | 'region'
  | 'national'
  | 'traffic'
  | 'music'
  | 'news'
  | 'sports'
  | 'business'
  | 'culture'
  | 'country'

// 电台分类配置
export interface RadioCategory {
  key: RadioCategoryType
  label: string
  icon: string
}

// 电台分类枚举（用于映射）
export const RadioCategoryEnum: RadioCategory[] = [
  { key: 'favorites', label: '收藏', icon: 'heart-fill' },
  { key: 'hot', label: '热门', icon: 'flame-fill' },
  { key: 'region', label: '地区', icon: 'mappin-and-ellipse' },
  { key: 'national', label: '国家台', icon: 'antenna-radiowaves' },
  { key: 'traffic', label: '交通台', icon: 'car-fill' },
  { key: 'music', label: '音乐台', icon: 'music-note' },
  { key: 'news', label: '新闻台', icon: 'newspaper-fill' },
  { key: 'sports', label: '体育台', icon: 'figure-run' },
  { key: 'business', label: '经济', icon: 'dollarsign' },
  { key: 'culture', label: '文化', icon: 'lightbulb-fill' },
  { key: 'country', label: '其他国家', icon: 'globe-americas' }
]
