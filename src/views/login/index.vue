<template>
  <div class="login">
    <el-form ref="form" :model="form"
    label-position="top"
    :rules="rules"
    label-width="80px">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password"
        type="password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
        :loading="isLoginLoading"
        @click="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/*
import qs from 'qs'
import request from '@/utils/request.js'
*/
import { login } from '@/services/user.js'
export default {
  name: 'Login',
  data () {
    return {
      // 存储表单数据的对象
      form: {
        phone: '18201288771',
        password: '111111'
      },
      // 用于设置表单校验规则
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          // pattern表示正则校验，以1开头，后跟10位数字
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '密码长度为6到18位', trigger: 'blur' }
        ]
      },
      // 是否在加载中
      isLoginLoading: false
    }
  },
  methods: {
    // 登录校验
    async onSubmit () {
      /*
      this.$store.commit('add', {
        count: 5,
        delay: 2000
      })
      */
      /*
      this.$store.dispatch('addHandler', { count: 5, delay: 2000 })
      this.$store.dispatch('addHandler', { count: 2, delay: 1000 })
      this.$store.dispatch('addHandler', { count: 1, delay: 500 })
      */
      /*
      this.$refs.form.validate(valid => {
        console.log(valid)  // false或true
        if (valid) {
        } else {
        }
        // console.log(await this.$refs.form.validate()) // try catch进行处理
      })
      */
      try {
        // 设置校验成功后的功能（请求）
        await this.$refs.form.validate()
        // 在请求发送前更改loading状态，请求发送后，再次更改loading状态
        this.isLoginLoading = true
        // console.log('通过了校验')
        // console.log(qs.stringify(this.form))
        /*
        const { data } = await request({
          method: 'POST',
          url: '/front/user/login',
          // qs自动帮设置下面这句话
          // headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
          // urlencoded格式：name=zs&age=21
          data: {
            phone: this.form.phone,
            password: this.form.password
          }
          data: qs.stringify(this.form)
        })
        */
        const { data } = await login(this.form)
        this.isLoginLoading = false
        // console.log(data) // 根究data的结果进行响应结果处理
        if (data.state === 1) {
          this.$message.success('登录成功')
          // 将登陆信息存储到vuex中
          this.$store.commit('setUser', data.content)
          // 根据可能存在的redirect数据进行跳转设置
          this.$router.push(this.$route.query.redirect || '/')
        } else {
          // alert(data.message)
          this.$message.error('登录失败')
        }

        // 发送请求进行处理
      } catch (err) {
        // 设置校验没有成功的功能（错误提示）
        console.log('没有通过校验')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  // 设置内部元素垂直水平居中
  align-items: center;
  justify-content: center;
  .el-form {
    background-color: #fff;
    padding: 20px;
    width: 300px;
    border-radius: 10px;
    .el-button {
      width: 100%;
    }
  }
}
</style>
