<template>
  <div class="resource-category">
      <el-card>
          <el-button>添加</el-button>
          <el-table
            :data="categories"
            style="width: 100%">
            <el-table-column
                type="index"
                label="编号"
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称"
                width="180">
            </el-table-column>
            <el-table-column
                label="创建时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.createdTime | dateFormat}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="sort"
                label="排序">
            </el-table-column>
            <el-table-column
                label="操作">
            </el-table-column>
            </el-table>
      </el-card>
  </div>
</template>

<script>
import { getResourceCategories } from '@/services/resource.js'
export default {
  name: 'ResourceCategory',
  data () {
    return {
      categories: []
    }
  },
  created () {
    this.loadResourceCategories()
  },
  methods: {
    async loadResourceCategories () {
      const { data } = await getResourceCategories()
      console.log(data)
      if (data.code === '000000') {
        this.categories = data.data
      }
    }
  },
  filters: {
    dateFormat (date) {
      date = new Date(date)
      return `${date.getFullYear()} - ${date.getMonth() + 1} - ${date.getDate()}
      ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
      `
    }
  }
}
</script>

<style>

</style>
