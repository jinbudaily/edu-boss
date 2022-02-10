<template>
  <div class="role-list">
      <!-- card卡片，上面为表单，中间为添加角色按钮，下面为table -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-form ref="form" :model="form" label-width="80px" :inline="true">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="form.name" clearable placeholder="角色名称" style="width: 200px;"></el-input>
            </el-form-item>
            <el-form-item style="float: right;">
              <el-button type="primary" @click="onSubmit">查询</el-button>
              <el-button @click="onReset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 点击按钮时显示对话框 -->
        <el-button @click="handleAdd">添加角色</el-button>
        <el-table
          :data="roles"
          v-loading="isLoading"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="编号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="角色名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="description"
            label="描述">
          </el-table-column>
          <el-table-column label="添加时间">
            <template slot-scope="scope">
              <span>{{ scope.row.createdTime | dateFormat}}</span>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <div>
                <el-button type="text"
                @click="$router.push({
                  name: 'alloc-menu',
                  params: {
                    roleId: scope.row.id
                  }
                })"
                >
                  分配菜单
                </el-button>
                <el-button type="text">
                  分配资源
                </el-button>
              </div>
              <div>
                <el-button type="text" class="edit"
                  @click="handleEdit(scope.row)">
                  编辑
                </el-button>
                <el-button type="text"
                  @click="handleDelete(scope.row)">
                  删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页结构 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[10, 15, 20]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
        <!-- 添加角色的dialog对话框 -->
        <el-dialog title="添加角色" :visible.sync="dialogFormVisible">
          <!-- 将添加和编辑封装成一个组件-->
          <create-or-edit
          @success="handleAddSuccess"
          @cancel="handleCancel"
          :is-edit="isEdit"
          :title="isEdit ? '编辑角色': '添加角色'"
          :role-id="roleId"
          ></create-or-edit>
        </el-dialog>
      </el-card>
  </div>
</template>

<script>
import CreateOrEdit from './CreateOrEdit.vue'
import { getRolePages, deleteRole } from '@/services/role.js'
export default {
  name: 'RoleList',
  components: {
    CreateOrEdit
  },
  data () {
    return {
      form: {
        name: '',
        current: 1,
        size: 10
      },
      roles: [],
      // 总数
      totalCount: 0,
      // 是否在加载状态
      isLoading: false,
      // dialog是否显示
      dialogFormVisible: false,
      // 控制对话框的功能
      isEdit: false,
      // 存储正在编辑的的角色id
      roleId: ''
    }
  },
  created () {
    this.loadRoles()
  },
  methods: {
    // 新增
    handleAdd () {
      this.dialogFormVisible = true
      this.isEdit = false
    },
    // 取消新增
    handleCancel () {
      this.dialogFormVisible = false
    },
    // 新增成功
    handleAddSuccess () {
      this.dialogFormVisible = false
      this.loadRoles()
    },
    // 编辑
    handleEdit (role) {
      this.isEdit = true
      this.dialogFormVisible = true
      // 将roleId传给子组件
      this.roleId = role.id
    },
    // 删除角色
    handleDelete (role) {
      this.$confirm(`确认角色：${role.name}`, '删除提示')
        .then(async () => {
          await deleteRole(role.id)
          this.$message.success('删除成功')
          this.loadRoles()
        }).catch(err => {
          if (err && err.response) {
            this.$message.error('删除失败，请重试')
          } else {
            this.$message.info('取消删除')
          }
        })
    },
    // 处理每页数据规模
    handleSizeChange (val) {
      // console.log(val)
      this.form.size = val
      this.form.current = 1
      this.loadRoles()
    },
    // 处理当前页数
    handleCurrentChange (val) {
      // console.log(val)
      this.form.current = val
      this.loadRoles()
    },
    onSubmit () {
    },
    // 重置
    onReset () {
      this.$refs.form.resetFields()
    },
    // 获取角色列表
    async loadRoles () {
      this.isLoading = true
      // 要传递form
      const { data } = await getRolePages(this.form)
      // console.log(data)
      this.roles = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false
    }
  },
  filters: {
    // 日期过滤器
    dateFormat (date) {
      date = new Date(date)
      return `
      ${date.getFullYear()} - ${date.getMonth() + 1}- ${date.getDate()}
      :${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
      `
    }
  }
}
</script>

<style scoped lang="scss">
  .edit {
    margin-right: 30px;
    margin-left: 5px;
  }
</style>
