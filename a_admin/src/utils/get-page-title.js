import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Vue Element Admin'
const test = process.env.VUE_APP_BASE_API.indexOf('test') > 0

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${test ? '[测试]' : ''}${title}-${pageTitle}`
  }
  return `${test ? '[测试]' : ''}${title}`
}
