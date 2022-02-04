<template>
  <div class="menu-create-or-edit">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{ isEdit ? '编辑菜单' : '添加菜单'}}</span>
        </div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="菜单名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="菜单路径">
                <el-input v-model="form.href"></el-input>
            </el-form-item>
            <el-form-item label="上级菜单">
              <!-- 上级菜单，需要请求服务端数据 -->
                <el-select v-model="form.parentId" placeholder="请选择上级菜单">
                  <!-- 无上级菜单 -->
                  <el-option label="无上级菜单"
                  :value="-1"
                  ></el-option>
                  <!-- 选择一级菜单 -->
                    <el-option
                      v-for ="item in parentMenuList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item label="前端图标">
                <el-input v-model="form.icon"></el-input>
            </el-form-item>
            <el-form-item label="是否显示">
                <el-radio-group v-model="form.shown">
                  <!-- label的数据会在选择后设置为给v-model绑定的值 -->
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="排序">
                <el-input-number v-model="form.orderNum"></el-input-number>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">提交</el-button>
                <el-button v-if="!isEdit">重置</el-button>
            </el-form-item>
        </el-form>
      </el-card>
  </div>
</template>

<script>
import { getEditMenuInfo, createOrUpdateMenu } from '@/services/menu.js'
export default {
  name: 'CreateOrEdit',
  // 通过props接收父组件传值，判断当前是那种功能（添加或编辑
  props: {
    isEdit: {
      type: Boolean,
      // 默认为添加功能
      default: false
    }
  },
  data () {
    return {
      form: {
        parentId: -1,
        name: '',
        href: '',
        icon: '',
        orderNum: '',
        description: '',
        shown: true
      },
      // 存储上级菜单数据
      parentMenuList: []
    }
  },
  created () {
    // 加载上级菜单信息
    this.loadMenuInfo()
  },
  methods: {
    async loadMenuInfo () {
      // 请求菜单数据
      // console.log(this.$route.params.id)
      // 监测是否存在路由参数id,并进行对应处理
      const id = this.$route.params.id || -1
      const { data } = await getEditMenuInfo(id)
      console.log(data)
      if (data.code === '000000') {
        this.parentMenuList = data.data.parentMenuList
        // 检测是否存在菜单数据menuInfo,如果存在，更新给form即可
        if (data.data.menuInfo) {
          this.form = data.data.menuInfo
        }
      }
    },
    async onSubmit () {
      // 1. 表单校验（内容是否为空）
      // 2. 发送请求
      const { data } = await createOrUpdateMenu(this.form)
      console.log(data)
      if (data.code === '000000') {
        this.$message.success('提交成功')
        this.$router.push({
          name: 'menu'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
