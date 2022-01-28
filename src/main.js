import Vue from 'vue'
import App from './App.vue'
// webpack打包时会默认找到该文件夹下的index.js
import router from './router'
import store from './store'
// 引入Element
import ElementUI from 'element-ui'
// 引入Element的主题文件
// import 'element-ui/lib/theme-chalk/index.css'
// 将element注册为vue插件
import './styles/index.scss'
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
