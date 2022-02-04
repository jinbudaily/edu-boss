<template>
  <div class="menu">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-button @click="$router.push({
            name: 'menu-create'
          })">添加菜单</el-button>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            type="index"
            label="编号"
            width="50">
          </el-table-column>
          <el-table-column
            prop="name"
            label="菜单名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="level"
            label="菜单级数"
          >
          </el-table-column>
          <el-table-column
            prop="icon"
            label="前端图标">
          </el-table-column>
          <el-table-column
            prop="orderNum"
            label="排序">
          </el-table-column>
          <!-- 当前行的数据如何获取 -->
          <!-- scoped slot -->
          <!-- v-slot和slot-scope(向组件传递的数据) -->
          <el-table-column
            width="180"
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
  </div>
</template>

<script>
import { getAllMenus, deleteMenu } from '@/services/menu.js'
export default {
  name: 'Menu',
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.loadAllMenus()
  },
  methods: {
    // 编辑
    handleEdit (rowData) {
      this.$router.push({
        name: 'menu-edit',
        params: {
          id: rowData.id
        }
      })
    },
    // 删除按钮要有提示框
    handleDelete (rowData) {
      // console.log(rowData)
      // 删除的确认提示
      this.$confirm('确认删除吗?', '删除提示')
        .then(async () => {
          // 发送删除请求
          const { data } = await deleteMenu(rowData.id)
          // console.log(data)
          if (data.code === '000000') {
            this.$message.success('删除成功')
          }
          // 更新数据列表
          this.loadAllMenus()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 删除
    // 获取所有菜单信息
    async loadAllMenus () {
      const { data } = await getAllMenus()
      // console.log(data)
      if (data.code === '000000') {
        this.tableData = data.data
      }
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
