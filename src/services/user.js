import request from '@/utils/request.js'
import qs from 'qs'
// import store from '@/store/index.js'

// 用户登录接口
export const login = data => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    data: qs.stringify(data)
  })
}

// 用户基本信息接口
// Authorization在请求头中设置
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
    /*
    // Authorization存放在vuex中state.user.access_token
    headers: {
      Authorization: store.state.user.access_token
    }
    */
  })
}
