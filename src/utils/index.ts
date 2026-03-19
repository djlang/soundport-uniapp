/**
 * 工具函数 - 防抖
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

/**
 * 工具函数 - 节流
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 格式化时间（秒 -> MM:SS）
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * 安全 URL 转换
 */
export function safeUrl(string: string): string | null {
  if (!string) return null
  if (string.startsWith('http://') || string.startsWith('https://')) {
    return string
  }
  return string
}

/**
 * 去重函数
 */
export function filterDuplicates(
  newList: any[],
  existingList: any[],
  idKey = 'changeuuid',
  nameKey = 'name'
): any[] {
  const seenIds = new Set<string>()
  const seenNames = new Set<string>()

  // 先记录现有数据
  for (const item of existingList) {
    seenIds.add(item[idKey])
    seenNames.add(item[nameKey]?.toLowerCase().trim())
  }

  // 按有无 logo 排序，有 logo 的优先
  const sortedList = [...newList].sort((a, b) => {
    const aHasLogo = !!a.logoUrl
    const bHasLogo = !!b.logoUrl
    if (aHasLogo !== bHasLogo) return aHasLogo ? -1 : 1
    return 0
  })

  // 过滤去重
  return sortedList.filter(item => {
    const id = item[idKey]
    const normalizedName = item[nameKey]?.toLowerCase().trim()

    if (!id || !normalizedName) {
      return false
    }

    if (seenIds.has(id) || seenNames.has(normalizedName)) {
      return false
    }

    seenIds.add(id)
    seenNames.add(normalizedName)
    return true
  })
}

/**
 * 构建请求头（H5 不允许设置 User-Agent）
 */
export function buildRequestHeaders(): Record<string, string> {
  // #ifdef H5
  return {}
  // #endif
  return { 'User-Agent': '声泊 Radio/1.0' }
}
