<template>
  <div class="course-image">
    <el-form-item :label="label">
      <!-- 进度条
      178是图片组件的宽度
       -->
      <el-progress
      :percentage="percentage"
      type="circle"
      :width="178"
      v-if="isUploading"
      :status="percentage === 100 ? 'success' : undefined"
      ></el-progress>
      <el-upload
        v-else
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :http-request="handleUpload"
        >
        <!-- img为预览图片的显示位置 -->
        <img v-if="previewUrl" :src="previewUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
  </div>
</template>

<script>
import { uploadCourseImage } from '@/services/course.js'
export default {
  name: 'CourseImage',
  props: {
    value: {
      type: String
    },
    label: {
      type: String
    },
    limit: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      isUploading: false,
      // 百分比
      percentage: 0
    }
  },
  methods: {
    // 上传图片
    async handleUpload (option) {
      this.isUploading = true
      // option是上传图片的相关信息
      // option.file为上传的文件的信息
      // console.log(option)
      // 使用formData对象处理
      const fd = new FormData()
      fd.append('file', option.file)
      const { data } = await uploadCourseImage(fd, (event) => {
        this.percentage = Math.floor(event.loaded / event.total * 100)
      })
      // console.log(data)
      if (data.code === '000000') {
        // data.data.name是服务端响应的，图片上传成功的线上地址
        // this.course.courseListImg = data.data.name
        // 由于v-model绑定了courseListImg, 激发自定义事件,传入数据
        this.$emit('input', data.data.name)
        this.$message.success('上传成功')
        this.isUploading = false
        // 当上传成功后，设置进度信息归零（避免回退）
        this.percentage = 0
      }
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < this.limit

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  },
  computed: {
    previewUrl () {
      return this.imageUrl || this.value
    }
  }
}
</script>

<style lang="scss" scoped>
// scope的效果是什么？
// 避免组件间样式冲突, 当有scoped属性时，css只作用于当前组件中的元素
// vue loader
// 如果希望scoped样式中的一个选择器能够作用的更深，例如影响子组件
// 可以使用 >>> 或者 ::v-deep
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
