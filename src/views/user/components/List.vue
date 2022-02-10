<template>
  <div class="user-list">
    <el-card>
      <div slot="header" class="clearfix">
        <el-form
        ref="user-info"
        :inline="true"
        :model="userInfo"
        label-width="80px">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="userInfo.phone" clearable></el-input>
          </el-form-item>
          <el-form-item label="注册时间" prop="rangeDate">
            <el-date-picker
              v-model="userInfo.rangeDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-mm-dd"
            />
          </el-form-item>
          <el-form-item>
            <el-button
            :disabled="isLoading"
            type="primary"
            @click="handleQuery"
            >搜索</el-button>
            <el-button
            @click="onReset"
            :disabled="isLoading"
            >重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 用户表格信息 -->
      <el-table
        v-loading="isLoading"
        :data="users"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="用户ID"
          width="100">
        </el-table-column>
        <el-table-column
          label="头像"
          width="100">
          <template slot-scope="scope">
            <img width="30px" :src="scope.row.portrait || 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png' "/>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          width="100"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="phone"
          width="180"
          label="手机号">
        </el-table-column>
        <el-table-column
          label="注册时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status"
              active-color="#13ce66"
              active-value="ENABLE"
              inactive-value="DISABLE"
              inactive-color="#ff4949"
              @change="handleForbidUser(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
            type="text"
            @click="handleSelectRole(scope.row)"
            >分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userInfo.currentPage"
        :page-sizes="[10, 15, 20]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!-- 分配角色对话框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="dialogVisible"
        width="50%"
      >
      <!-- 下拉菜单 -->
      <!-- label是看的内容，value是提交的内容 -->
        <el-select v-model="roleIdList" multiple placeholder="请选择">
              <el-option
                v-for="role in roles"
                :key="role.id"
                :value="role.id"
                :label="role.name"
              ></el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAllocRole">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getUserPages, forbidUser } from '@/services/user.js'
// allocateUserRoles
import { getAllRoles, getUserRoles, allocateUserRoles } from '@/services/role.js'
export default {
  name: 'UserList',
  data () {
    return {
      userInfo: {
        phone: '',
        currentPage: 1,
        pageSize: 10,
        // 开始时间
        startCreateTime: '',
        // 截止时间
        endCreateTime: '',
        // 时间范围
        rangeDate: []
      },
      // 每页展示用户数据
      users: [],
      // 用户总数
      total: 0,
      // 是否在加载状态中
      isLoading: false,
      // dialog是否显示
      dialogVisible: false,
      // 下拉菜单数据(所有角色)
      roles: [],
      // 选中项id组成的数组
      roleIdList: [],
      // 当前用户id
      currentUserID: null
    }
  },
  created () {
    // 加载用户
    this.loadUsers()
  },
  methods: {
    // 提交分配(提交的内容包括userId和roleIdList(v-model绑定))
    async handleAllocRole () {
      const { data } = await allocateUserRoles({
        userId: this.currentUserID,
        roleIdList: this.roleIdList
      })
      if (data.code === '000000') {
        this.$message.success('分配角色成功')
        this.dialogVisible = false
      }
    },
    // 用户分配角色按钮，弹出对话框
    async handleSelectRole (rowData) {
      this.currentUserID = rowData.id
      // 显示对话框
      this.dialogVisible = true
      // 请求所有角色列表
      const { data } = await getAllRoles()
      // console.log(data)
      if (data.code === '000000') {
        this.roles = data.data
      }
      // 请求当前用户的已经分配的角色信息
      const { data: data2 } = await getUserRoles(rowData.id)
      // console.log(data2)
      if (data2.code === '000000') {
        this.roleIdList = data2.data.map(item => item.id)
      }
    },
    // 加载用户信息
    async loadUsers () {
      this.isLoading = true
      const { rangeDate } = this.userInfo
      // console.log(rangeDate)
      if (rangeDate && rangeDate.length) {
        this.userInfo.startCreateTime = rangeDate[0]
        this.userInfo.endCreateTime = rangeDate[1]
      } else {
        this.userInfo.startCreateTime = ''
        this.userInfo.endCreateTime = ''
      }
      const { data } = await getUserPages(this.userInfo)
      // console.log(data)
      if (data.code === '000000') {
        this.users = data.data.records
        this.total = data.data.total
        this.isLoading = false
      }
    },
    // 禁用用户
    async handleForbidUser (user) {
      const { data } = await forbidUser(user.id)
      console.log(data)
    },
    handleQuery () {
      this.userInfo.currentPage = 1
      this.loadUsers()
    },
    onReset () {
      this.$refs['user-info'].resetFields()
      this.loadUsers()
    },
    handleSizeChange (val) {
      // console.log(val)
      this.userInfo.pageSize = val
      this.userInfo.currentPage = 1
      this.loadUsers()
    },
    handleCurrentChange (val) {
      // console.log(val)
      this.userInfo.currentPage = val
      this.loadUsers()
    }
  },
  filters: {
    dateFormat (date) {
      date = new Date(date)
      return `${date.getFullYear()} - ${date.getMonth() + 1} - ${date.getDate()}
      ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }
  }
}
</script>

<style>

</style>
