<template>
  <div class="create-or-edit">
    <el-form :model="role">
        <el-form-item label="角色名称">
            <el-input v-model="role.name"></el-input>
        </el-form-item>
        <el-form-item label="角色编码">
            <el-input v-model="role.code"></el-input>
        </el-form-item>
        <el-form-item label="描述">
            <el-input type="textarea" v-model="role.description"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button @click="onCancel">取消</el-button>
            <el-button
                type="primary"
                @click="onSubmit"
            >确认</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createOrUpdateRole, getRoleById } from '@/services/role.js'
export default {
  name: 'CreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: [Number, String]
    }
  },
  created () {
    this.loadRole()
  },
  data () {
    return {
      role: {
        name: '',
        code: '',
        description: ''
      }
    }
  },
  methods: {
    // 获取角色
    async loadRole () {
      // rolId是传递过来的props
      const { data } = await getRoleById(this.roleId)
      console.log(data)
      this.role = data.data
    },
    // 确定时， 1. 发送内容 2. 关闭提示框（向父组件传递数据，自定义事件）3. 成功提示 4. 清除表单内容
    async onSubmit () {
      const { data } = await createOrUpdateRole(this.role)
      // console.log(data)
      if (data.code === '000000') {
        // 1. 关闭提示框
        this.$emit('success')
        // 2. 成功的消息提示
        this.$message.success('添加成功')
        // 3. 清除表单
        this.role = {}
      }
    },
    // 取消时，关闭提示框，清除表单
    onCancel () {
      this.$emit('cancel')
      this.role = {}
    }
  }
}
</script>

<style>

</style>
