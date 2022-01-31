<template>
  <div id="app">
    <!-- 根路由出口 -->
    <router-view/>
  </div>
</template>

<script>
/*
import request from '@/utils/request.js'
request({
  method: 'GET',
  url: '/front/ad/getAdList'
}).then(res => {
  console.log(res)
})
*/
export default {
  name: 'App'
}
</script>
<style lang="scss">
</style>
