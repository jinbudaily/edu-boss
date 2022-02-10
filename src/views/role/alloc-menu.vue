<template>
  <div class="alloc-menu">
      <!-- 通过路由获取roleId -->
      <!-- 这种情况下，路径必须与组件紧密使用，可以使用props: true -->
      <!-- {{ $route.params.roleId}} -->
      <!-- id为：{{ roleId }} -->
      <el-card>
        <el-tree
            ref="menu-tree"
            :data="menus"
            node-key="id"
            :props="defaultProps"
            :default-checked-keys="checkedKeys"
            show-checkbox
            default-expand-all>
        </el-tree>
        <div style="margin: 20px;" >
          <el-button @click="onSave">保存</el-button>
          <el-button type="primary" @click="onReset">清空</el-button>
        </div>
      </el-card>
  </div>
</template>

<script>
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu.js'
export default {
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  created () {
    // 加载所有的菜单信息（tree结构）
    this.loadMenus()
    // 加载当前角色已经分配的菜单信息
    this.loadRoleMenus()
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  methods: {
    // 清空
    onReset () {
      // 只是清空，没有保存
      this.$refs['menu-tree'].setCheckedKeys([])
    },
    // 获取checkedKeys(筛选出被选中菜单项id)
    // 难点：当父节点勾选，子节点也都勾选，所以即便父节点是勾选状态，也不应该作为依据（任意节点的父节点都应该排除）
    getCheckedKeys (menus) {
      // 遍历数据（将所有存在子节点的node排除，对子节点列表进行筛选）
      menus.forEach(menu => {
        if (!menu.selected) {
          return
        }
        // 检测是否存在子节点
        if (menu.subMenuList) {
          // 对子节点进行选中状态检测
          return this.getCheckedKeys(menu.subMenuList)
        }
        // 说明为选中的叶子节点，存储id
        // this.checkedKeys.push(menu.id) // 这样书写会造成数据频繁变化，页面频繁加载，结果可能不对(异步，数据变了，但是界面可能没变)
        this.checkedKeys = [...this.checkedKeys, menu.id]
      })
    },
    // 获取角色已经分配的菜单
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      // console.log(data)
      this.getCheckedKeys(data.data)
    },
    // 保存分配的菜单
    async onSave () {
      // console.log(this.$refs['menu-tree'].getCheckedNodes())
      // console.log(this.$refs['menu-tree'].getCheckedKeys())
      //  通过this.$refs获取dom结构或者组件
      const { data } = await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList: this.$refs['menu-tree'].getCheckedKeys()
      })
      // console.log(data)
      if (data.code === '000000') {
        this.$message.success('分配菜单成功')
        this.$router.push({
          name: 'role'
        })
      }
    },
    // 获取菜单并按层级显示
    async loadMenus () {
      const { data } = await getMenuNodeList()
      // console.log(data)
      if (data.code === '000000') {
        this.menus = data.data
      }
    }
  }
}
</script>

<style>

</style>
