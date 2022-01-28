<template>
  <el-container>
    <el-aside width="200px">
      <!-- 侧边栏组件 -->
      <app-aside></app-aside>
    </el-aside>
    <el-container>
      <el-header>
        <app-header></app-header>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './components/AppAside.vue'
import AppHeader from './components/AppHeader.vue'
export default {
  name: 'Layout',
  components: {
    AppAside,
    AppHeader
  }
}
</script>

<style lang="scss" scoped>
  // 该容器是被内容撑开
  .el-container {
    height: 100vh;
    // min-width: 980px;
  }
  .el-aside {
    background-color: #d3dce6;
  }
  .el-header {
    background-color: #fff;
  }
  .el-main {
    background-color: #e9eef3;
  }

</style>
