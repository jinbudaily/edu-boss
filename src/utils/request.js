import axios from 'axios'

// 创建axios实例
const request = axios.create({
// timeout,baseURL,headers的配置
  timeout: 5000
})
// 封装方法，用于获取baseURL
function getBaseURL (url) {
  // 判断config.url来进行请求地址的拼接
  if (url.startsWith('/front')) {
    return 'http://edufront.lagounews.com/'
  } else {
    return 'http://eduboss.lagounews.com/'
  }
}
// 请求拦截器
request.interceptors.request.use(config => {
  // console.log(config) /// config.url指的是请求地址
  // config.URL是属性，会自动拼接到url请求的前面
  config.baseURL = getBaseURL(config.url)
  return config
})
export default request
