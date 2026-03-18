/**
 * 地区映射工具
 * 用于将中文地区名映射为 API 参数
 */
export const RegionMapper = {
  // 省份映射（中文 -> API 用英文名）
  provinceToApi: new Map<string, string>([
    ['北京', 'Beijing'],
    ['上海', 'Shanghai'],
    ['广东', 'Guangdong'],
    ['江苏', 'Jiangsu'],
    ['浙江', 'Zhejiang'],
    ['福建', 'Fujian'],
    ['四川', 'Sichuan'],
    ['湖北', 'Hubei'],
    ['山东', 'Shandong'],
    ['河南', 'Henan'],
    ['河北', 'Hebei'],
    ['湖南', 'Hunan'],
    ['安徽', 'Anhui'],
    ['江西', 'Jiangxi'],
    ['陕西', 'Shaanxi'],
    ['山西', 'Shanxi'],
    ['重庆', 'Chongqing'],
    ['天津', 'Tianjin'],
    ['辽宁', 'Liaoning'],
    ['吉林', 'Jilin'],
    ['黑龙江', 'Heilongjiang'],
    ['内蒙古', 'Neimenggu'],
    ['广西', 'Guangxi'],
    ['海南', 'Hainan'],
    ['贵州', 'Guizhou'],
    ['云南', 'Yunnan'],
    ['西藏', 'Xizang'],
    ['甘肃', 'Gansu'],
    ['青海', 'Qinghai'],
    ['宁夏', 'Ningxia'],
    ['新疆', 'Xinjiang'],
    ['香港', 'Hong Kong'],
    ['澳门', 'Macao']
  ]),

  // 国家映射
  countryToApi: new Map<string, string>([
    ['美国', 'US'],
    ['英国', 'GB'],
    ['日本', 'JP'],
    ['韩国', 'KR'],
    ['德国', 'DE'],
    ['法国', 'FR'],
    ['澳大利亚', 'AU'],
    ['加拿大', 'CA'],
    ['俄罗斯', 'RU'],
    ['印度', 'IN'],
    ['其他国家', '']
  ]),

  /**
   * 将中文省份转为 API 参数
   */
  toApiParameter(province: string): string {
    return this.provinceToApi.get(province) || province
  },

  /**
   * 将中文国家转为 API 参数
   */
  toApiParameterForCountry(country: string): string {
    return this.countryToApi.get(country) || ''
  },

  /**
   * 获取省份列表
   */
  getProvinceList(): string[] {
    return Array.from(this.provinceToApi.keys())
  }
}
