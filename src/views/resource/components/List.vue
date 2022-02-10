<template>
  <div class="resource-list">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
            <!-- 使用行内表单 -->
            <el-form :inline="true" :model="form" class="demo-form-inline" ref="form">
                <el-form-item label="资源名称" prop="name">
                    <el-input v-model="form.name" placeholder="资源名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="资源路径" prop="url">
                    <el-input v-model="form.url" placeholder="资源路径" clearable></el-input>
                </el-form-item>
                <el-form-item label="资源分类" prop="categoryId">
                    <el-select v-model="form.categoryId" placeholder="资源分类" clearable>
                      <el-option
                      v-for="item in resourceCategories"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary"
                    @click="onSubmit"
                    :disabled="isLoading"
                    >查询搜索</el-button>
                    <el-button
                    @click="onReset"
                    >重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
          <el-button style="margin-right: 24px;">添加</el-button>
          <el-button @click="$router.push({
            name: 'resource-category'
          })">资源分类</el-button>
        </div>
        <div>
            <!-- 使用table表格组件 -->
            <el-table
                :data="resources"
                v-loading="isLoading"
                style="width: 100%">
                <el-table-column
                    type="index"
                    label="编号"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="资源名称">
                </el-table-column>
                <el-table-column
                    prop="url"
                    label="资源路径">
                </el-table-column>
                <el-table-column
                    prop="description"
                    label="描述">
                </el-table-column>
                <!-- 设置过滤器需要使用作用域插槽获取数据 -->
                <el-table-column
                    label="添加时间">
                    <template slot-scope="scope">
                        <span>{{ scope.row.createdTime | dateFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button size="mini" @click="handleDelete(scope.row)" type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页组件结构 -->
        <div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="form.current"
            :page-sizes="[10, 15, 20]"
            :page-size="form.size"
            :disabled="isLoading"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
          </el-pagination>
        </div>
        </el-card>
  </div>
</template>

<script>
import { getResourcePages, getResourceCategories, deleteResource } from '@/services/resource.js'
export default {
  name: 'ResourceList',
  data () {
    return {
      // 用于存储资源列表数据
      resources: [],
      form: {
        // 当前显示的页号
        current: 1,
        // 每页显示的数据条数
        size: 10,
        name: '',
        categoryId: '',
        url: ''
      },
      // 数据总数
      totalCount: 0,
      // 资源分类信息
      resourceCategories: [],
      // 用于保存加载状态
      isLoading: false
    }
  },
  created () {
    // 加载资源数据
    this.loadResources()
    // 加载资源列表
    this.loadResourceCategories()
  },
  methods: {
    // 重置内容
    onReset () {
      // 通过ref和prop
      this.$refs.form.resetFields()
    },
    // 点击提交
    onSubmit () {
      // 请求数据前，每次筛选前都应该将页面更新为1
      this.form.current = 1
      this.loadResources()
    },
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      // console.log(data)
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
    },
    async loadResources () {
      // 获取首页的10条数据
      // 最初请求为默认值
      // 请求数据时加载数据
      this.isLoading = true
      const { data } = await getResourcePages(this.form)
      //   console.log(data)
      if (data.code === '000000') {
        this.resources = data.data.records
        this.totalCount = data.data.total
        // 取消加载状态
        this.isLoading = false
      }
    },
    handleEdit () {

    },
    async handleDelete (rowData) {
      // console.log(rowData)
      this.$confirm('确认删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await deleteResource(rowData.id)
        // 无系统资源操作权限
        // console.log(data)
        if (data.code === '000000') {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
        // 重新加载数据
        this.loadResources()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 每页多少条
    handleSizeChange (val) {
      this.form.size = val
      // 由于修改了每页显示的条数，应当让页数还原为默认值1
      this.form.current = 1
      this.loadResources()
    },
    // 当前页号
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.form.current = val
      this.loadResources()
    }
  },
  filters: {
    // 日期过滤器
    dateFormat (date) {
      // console.log(date)
      date = new Date(date)
      return `${date.getFullYear()} - ${date.getMonth() + 1} - ${date.getDate()}
      ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
