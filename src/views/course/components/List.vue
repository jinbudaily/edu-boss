<template>
  <div class="course-list">
    <el-card class="box-card">
      <!-- 数据筛选表单 -->
      <el-form
        :inline="true"
        :model="filterParams"
        label-position="left"
        ref="form"
      >
        <el-form-item label="课程名称" prop="courseName">
          <el-input
          clearable
          v-model="filterParams.courseName">
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="filterParams.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" value="1"></el-option>
            <el-option label="下架" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
           :disabled="isLoading"
           @click="handleReset">重置</el-button>
          <el-button
          type="primary"
          :disabled="isLoading"
          @click="handleQuery">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        class="btnAdd"
        :isLoading="isLoading"
        @click="$router.push({name: 'course-create'})"
      >添加课程
      </el-button>
    </el-card>
    <el-card>
      <!-- 表格数据 -->
      <el-table
        :data="courses"
        v-loading="isLoading"
        style="width: 100%; marigin-bottom: 20px">
        <el-table-column
          prop="id"
          label="ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格">
        </el-table-column>
        <el-table-column
          prop="sortNum"
          label="排序">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                @change="onStateChange(scope.row)"
                :disabled="scope.row.isStatusLoading"
                :inactive-value="0">
              </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
              type="success"
              @click="$router.push({
                name: 'course-edit',
                params: {
                  courseId: scope.row.id
                }
              })"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="$router.push({
                name: 'course-section',
                params: {
                  courseId: scope.row.id
                }
              })"
            >
              内容管理
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="filterParams.currentPage"
        :page-sizes="[10, 15, 20]"
        :page-size="filterParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :disabled="isLoading"
        :total="totalCount">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getQueryCourses, changeState } from '@/services/course.js'
export default {
  name: 'CourseList',
  data () {
    return {
      filterParams: {
        currentPage: 1,
        pageSize: 10,
        courseName: '',
        status: ''
      },
      // 是否在加载状态中
      isLoading: false,
      // 课程总数
      totalCount: 0,
      // 课程
      courses: []
    }
  },
  created () {
    // 加载课程
    this.loadCourses()
  },
  methods: {
    // 上下架切换
    async onStateChange (course) {
      course.isStatusLoading = true
      const { data } = await changeState({
        courseId: course.id,
        status: course.status
      })
      // console.log(data)
      if (data.code === '000000') {
        this.$message.success(`${course.status === 1 ? '上架成功' : '下架成功'}`)
        course.isStatusLoading = false
      }
    },
    // 加载课程信息
    async loadCourses () {
      this.isLoading = true
      const { data } = await getQueryCourses(this.filterParams)
      // console.log(data)
      if (data.code === '000000') {
        // 用于显示更改的状态
        data.data.records.forEach(item => {
          item.isStatusLoading = false
        })
        // 保存课程信息
        this.courses = data.data.records
        this.totalCount = data.data.total
        this.isLoading = false
      }
    },
    // 重置
    handleReset () {
      this.$refs.form.resetFields()
      this.filterParams.currentPage = 1
      this.loadCourses()
    },
    // 筛选
    handleQuery () {
      this.filterParams.currentPage = 1
      this.loadCourses()
    },
    // 变更table每页条目数量
    handleSizeChange (val) {
      // console.log(val)
      this.filterParams.pageSize = val
      this.filterParams.currentPage = 1
      this.loadCourses()
    },
    // 变更页数
    handleCurrentChange (val) {
      // console.log(val)
      this.filterParams.currentPage = val
      this.loadCourses()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 20px;
}
.el-form {
  float: left;
}
.btnAdd {
  float: right;
}
</style>
