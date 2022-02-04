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
            <el-avatar :size="30"
            :src="userInfo.portrait || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"></el-avatar>
            <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <!-- 下拉菜单 -->
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>{{ userInfo.userName }}</el-dropdown-item>
            <!-- 给组件绑定的事件都是自定义事件,设置.native就会绑定到组件的根元素 -->
            <el-dropdown-item divided
            @click.native="handleLogout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
  </div>
</template>

<script>
import { getUserInfo } from '@/services/user.js'
export default {
  name: 'AppHeader',
  // created中加载用户信息，钩子中不建议书写逻辑,写封装的逻辑，逻辑在methods中书写
  created () {
    this.loadUserInfo()
  },
  data () {
    return {
      // 用户信息
      userInfo: {}
    }
  },
  methods: {
    // 记载用户信息
    async loadUserInfo () {
      const { data } = await getUserInfo()
      this.userInfo = data.content
    },
    // 退出功能
    handleLogout () {
      // 1. 提示操作
      this.$confirm('确认退出吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 1. 清除store中的用户信息
        this.$store.commit('setUser', null)
        // 2. 跳转登录页面
        this.$router.push('/login')
        // 3. 成功的消息提示
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
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
