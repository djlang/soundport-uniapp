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
    const normalizedName = item[nameKey]?.toLowerCase().trim()
    const isNewId = seenIds.add(item[idKey]).size > seenIds.size
    const isNewName = seenNames.add(normalizedName).size > seenNames.size
    return isNewId && isNewName
  })
}
