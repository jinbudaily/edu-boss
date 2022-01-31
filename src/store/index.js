import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    // mutation可以接收两个参数：state和payload
    // 一个是state中的数据，一个用于提交时的参数，一般是对象
    // mutation中不能有异步操作
    add (state, payload) {
      state.count += payload
    }
  },
  actions: {
    // 第一个参数是context(类似于store)
    // 第二个参数是payload
    addHandler (context, payload) {
      setTimeout(() => {
        // context与store功能完全相同
        context.commit('add', payload.count)
      }, payload.delay)
    }
  },
  modules: {
  }
})
