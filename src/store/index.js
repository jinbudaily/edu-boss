import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // count: 0
    // 用于登录成功后保存用户信息（初始值尝试读取本地存储）
    user: JSON.parse(window.localStorage.getItem('user')) || null
  },
  mutations: {
    // mutation可以接收两个参数：state和payload
    // 一个是state中的数据，一个用于提交时的参数，一般是对象
    // mutation中不能有异步操作
    /*
    add (state, payload) {
      state.count += payload
    }
    */
    setUser (state, payload) {
      // 将payload转换为对象后再存储,vuex并不具备持久化登录的能力
      state.user = JSON.parse(payload)
      // 将payload数据存储到本地存储中（本地存储不能存储对象）
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {
    // 第一个参数是context(类似于store)
    // 第二个参数是payload
    /*
    addHandler (context, payload) {
      setTimeout(() => {
        // context与store功能完全相同
        context.commit('add', payload.count)
      }, payload.delay)
    }
    */
  },
  modules: {
  }
})
