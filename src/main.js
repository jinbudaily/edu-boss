import Vue from 'vue'
import App from './App.vue'
// webpack打包时会默认找到该文件夹下的index.js
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
