<template>
  <div class="app-header">
      <!-- 左侧面包屑导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 右侧用户信息展示 -->
      <el-dropdown>
        <span class="el-dropdown-link">
            <!-- 用户头像 -->
            <el-avatar :size="30" :src="'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"></el-avatar>
            <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <!-- 下拉菜单 -->
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>用户信息</el-dropdown-item>
            <el-dropdown-item divided>登出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style lang="scss" scoped>
// flex布局：垂直居中值需要设置align-items: center
// 主轴方向内容的设置
.app-header {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // 头像和icon的父元素也设置为flex布局，并居中
    .el-dropdown-link {
        display: flex;
        align-items: center;
    }
}
</style>
