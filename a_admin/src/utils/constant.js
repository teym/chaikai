export const ActivityOrderStatus = [
  { name: '待审核', value: '1' },
  { name: '待缴押金', value: '2' },
  { name: '待发货', value: '3' },
  { name: '待收货', value: '4' },
  { name: '待测评', value: '5' },
  { name: '已测评', value: '6' },
  { name: '已关闭', value: '7' }
]

export const Channels = [
  { id: 1, name: '微博' },
  { id: 2, name: 'B站' },
  { id: 4, name: '小红书' },
  { id: 8, name: '抖音' },
  { id: 16, name: '快手' }
]
export const ChannelIcons = {
  '1': { icon: '@/assets/images/channel_wb.png', name: '微博' },
  '2': { icon: '@/assets/images/channel_bi.png', name: 'B站' },
  '4': { icon: '@/assets/images/channel_xhs.png', name: '小红书' },
  '8': { icon: '@/assets/images/channel_dy.png', name: '抖音' },
  '16': { icon: '@/assets/images/channel_ks.png', name: '快手' }
}
