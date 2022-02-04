import axios from 'axios'
import store from '@/store/index.js'
import router from '@/router/index.js'
// 通过局部引入的方式，引入element的message组件功能
import { Message } from 'element-ui'
// 引入qs,用于请求参数处理
import qs from 'qs'
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
// 存储是否正在更新token状态
let isRefreshing = false
// 数组中存放因为等待token刷新而挂起的请求
let requestArr = []
// 封装跳转登录的方法
function redirectLogin () {
  // 跳转登录页面
  router.push({
    name: 'login',
    query: {
      // currentRoute就是存储了路由信息的对象
      redirect: router.currentRoute.fullPath
    }
  })
}
// 请求拦截器
request.interceptors.request.use(config => {
  // console.log(config) /// config.url指的是请求地址
  // config.URL是属性，会自动拼接到url请求的前面
  config.baseURL = getBaseURL(config.url)

  // console.log(store.state) //  store.state
  // 统一设置token信息
  const { user } = store.state
  // console.log(user)
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
})

// 响应拦截器(这里的坑，axios改为request)
request.interceptors.response.use(response => {
  // 状态码为2xx的会执行这里
  // console.log('响应成功了', response)
  return response
}, error => {
  // console.dir(error)
  // 根据error.response进行处理
  if (error.response) {
    // 请求发送成功，响应接受，但是状态吗为失败的情况
    // error.response.data/status/headers
    // 1. 判断失败的状态码情况（主要处理401的情况）
    const { status } = error.response
    let errorMessage = ''
    if (status === 400) {
      errorMessage = '请求参数错误'
    } else if (status === 401) {
      // token过期处理（进行解决）
      // 1. 无token信息
      if (!store.state.user) {
        redirectLogin()
        // 截断后面的操作
        return Promise.reject(error)
      }
      // 2. token无效（错误token,过期token)
      // 刷新token的接口（服务端根据refresh_token刷新token)

      // 是否已经存在正在刷新token的请求
      if (isRefreshing) {
        // 将当前失败的请求，存储在请求列表中
        return requestArr.push(() => {
          // 当前函数调用后，会自动发送本次失败的请求
          request(error.config)
        })
        // return
      }
      isRefreshing = true
      // 发送请求，获取新的access_token
      return request({
        method: 'POST',
        url: '/front/user/refresh_token',
        data: qs.stringify({
          refreshtoken: store.state.user.refresh_token
        })
      }).then(res => {
        // 获得新的token
        // console.log(res)
        // 请求是否成功，如果成功，如果不成功
        // 刷新token失败
        if (res.data.state !== 1) {
          // 清除无效的用户信息
          store.commit('setUser', null)
          // 跳转登录页面
          redirectLogin()
          return Promise.reject(error)
        }
        // 刷新token成功
        // - 存储新的token
        store.commit('setUser', res.data.content)
        // - 重新发送失败的请求
        // error.config是本次失败的请求的配置对象
        // request(error.config)
        requestArr.forEach(callback => callback())
        // 发送完毕，请求requesArr的内容
        requestArr = []
        // 本次请求也要发送
        return request(error.config)
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        // 请求发送完毕，响应处理完毕，将刷新状态更改为false即可
        isRefreshing = false
      })
      // errorMessage = 'Token无效'
    } else if (status === 403) {
      errorMessage = '没有权限，请联系管理员'
    } else if (status === 404) {
      errorMessage = '请求资源不存在'
    } else if (status >= 500) {
      errorMessage = '服务端错误，请联系管理员'
    }
    // console.error(errorMessage)
    Message.error(errorMessage)
  } else if (error.request) {
    // 请求发送，但是没有收到响应
    Message.error('请求超时，请重试')
  } else {
    // 意料之外的错误
    Message.error(error.message)
  }
  // 将本次错误对象继续向后抛出。由接受响应的处理函数进行操作 try catch进行处理
  return Promise.reject(error)
})
export default request
