<template>
  <div class="create-or-edit">
    <el-card>
      <div slot="header">
        <el-steps :active="activeStep" simple>
          <el-step
          v-for="(item, i) in steps"
          :key="item.id"
          :title="item.title"
          :icon="item.icon"
          @click.native="activeStep = i"
          ></el-step>
        </el-steps>
      </div>
      <!-- 步骤条对应的表单 -->
      <!-- 这里还可以做表单校验 -->
      <el-form label-width="80px">
        <!-- 基本信息 -->
        <div v-show="activeStep === 0">
          <el-form-item label="课程名称">
            <el-input v-model="course.courseName"></el-input>
          </el-form-item>
          <el-form-item label="课程简介">
            <el-input v-model="course.brief"></el-input>
          </el-form-item>
          <el-form-item label="课程概述">
            <el-input
            v-model="course.previewFirstField"
            placeholder="概述1"
            style="width: 48%; min-width: 300px"
            >
            <template slot="append">
              {{course.previewFirstField.length}} / 20
            </template>
            </el-input>
            <el-input
            v-model="course.previewSecondField"
            placeholder="概述2"
            style="width: 48%; min-width: 300px"
            >
            <template slot="append">
              {{course.previewSecondField.length}} / 20
            </template>
            </el-input>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input
              v-model="course.teacherDTO.teacherName"
            ></el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input
              v-model="course.teacherDTO.description"
            ></el-input>
          </el-form-item>
          <el-form-item label="课程排序">
             <el-input-number
             label="描述文字"
             v-model="course.sortNum"
             controls-position="right"></el-input-number>
          </el-form-item>
        </div>
        <!-- 课程封面 -->
        <div v-show="activeStep === 1">
          <!-- 封装为图片上传组件 -->
          <course-image v-model="course.courseListImg"
          label="课程封面"
          ></course-image>
          <course-image v-model="course.courseImgUrl"
          label="解锁封面"
          ></course-image>
        </div>
        <!-- 销售信息 -->
        <div v-show="activeStep === 2">
          <el-form-item label="售卖价格">
            <el-input
            v-model="course.discounts"
            type="number"
            :min="0"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
           <el-form-item label="商品原价">
            <el-input
            type="number"
            :min="0"
            v-model="course.price"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
           <el-form-item label="销量">
            <el-input
            type="number"
            :min="0"
            v-model="course.sales"
            >
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
           <el-form-item label="活动标签">
            <el-input
            v-model="course.discountsTag"
            ></el-input>
          </el-form-item>
        </div>
        <!-- 秒杀信息 -->
        <div v-show="activeStep === 3">
          <el-form-item label="限时秒杀开关" label-width="120px">
            <el-switch
              v-model="course.activityCourse"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <!-- 为什么使用v-if? 不秒杀的时候不提交该信息 -->
          <template v-if="course.activityCourse">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="course.activityCourseDTO.beginTime"
                type="datetime"
                placeholder="选择开始时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                type="datetime"
                v-model="course.activityCourseDTO.endTime"
                placeholder="选择结束时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input
              type="number"
              :min="0"
              v-model="course.activityCourseDTO.amount"
              >
              <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="秒杀库存">
              <el-input
              type="number"
              :min="0"
              v-model="course.activityCourseDTO.stock"
              >
              <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </template>
        </div>
        <!-- 课程详情 -->
        <div v-show="activeStep === 4">
          <el-form-item label="课程详情">
            <!-- <el-input type="textarea"
            v-model="course.courseDescriptionMarkDown"></el-input> -->
            <!-- <div ref="editor"></div> -->
            <text-editor v-model="course.courseDescriptionMarkDown"></text-editor>
          </el-form-item>
          <el-form-item label="是否上架">
            <el-switch
            v-model="course.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            >
            </el-switch>
          </el-form-item>
          <el-form-item>
            <el-button
            type="primary"
            @click="handleSave"
            >保存</el-button>
          </el-form-item>
        </div>
        <!-- 下一步按钮 -->
        <el-form-item v-if="activeStep !== steps.length - 1">
          <el-button type="primary"
            @click="activeStep++"
          >下一步</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import CourseImage from './CourseImage.vue'
import { saveOrUpdateCourse, getCourseById } from '@/services/course.js'
// import E from 'wangeditor'
import TextEditor from '@/components/TextEditor'
export default {
  name: 'CreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: [Number, String]
    }
  },
  components: {
    CourseImage,
    TextEditor
  },
  created () {
    // 检测当前是否为编辑功能，如果是，根据courseId请求课程数据
    if (this.isEdit) {
      this.loadCourse()
    }
  },
  data () {
    return {
      activeStep: 0,
      steps: [
        { id: 0, title: '基本信息', icon: 'el-icon-edit' },
        { id: 1, title: '课程封面', icon: 'el-icon-upload' },
        { id: 2, title: '销售信息', icon: 'el-icon-edit' },
        { id: 3, title: '秒杀信息', icon: 'el-icon-edit' },
        { id: 4, title: '课程详情', icon: 'el-icon-edit' }
      ],
      // 本地预览图片地址
      imageUrl: '',
      // 课程信息
      course: {
        // id: 0,
        courseName: '',
        brief: '',
        teacherDTO: {
          // id: 0,
          // courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        // 这里设置默认文本必须使用标签形式，因为富文本编辑器里面的内容都是标签形式
        courseDescriptionMarkDown: '',
        price: 0,
        discounts: 0,
        priceTag: '',
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        courseListImg: '',
        courseImgUrl: '',
        sortNum: 0,
        previewFirstField: '',
        previewSecondField: '',
        // 上架状态，1代表上架
        status: 0,
        sales: 0,
        // 参与秒杀的课程
        activityCourse: false,
        activityCourseDTO: {
          // id: 0,
          // courseId: 0,
          // 开启秒杀时间
          beginTime: '',
          // 结束秒撒谎时间
          endTime: '',
          // 秒杀价
          amount: 0,
          // 秒杀库存
          stock: 0
        },
        autoOnlineTime: ''
      }
    }
  },
  methods: {
    //  加载课程
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      // console.log(data)
      if (data.code === '000000') {
        // this.course = data.data
        // 判断当前课程是否开启秒杀，如果没有开启秒杀，需要初始化数据
        if (!data.data.activityCourseDTO) {
          data.data.activityCourseDTO = {
            beginTime: '',
            endTime: '',
            amount: 0,
            stock: 0
          }
        }
        this.course = data.data
      }
    },
    async handleSave () {
      const { data } = await saveOrUpdateCourse(this.course)
      // console.log(data)
      if (data.code === '000000') {
        this.$message.success(`${this.isEdit ? '编辑成功' : '添加成功'}`)
        this.$router.push({
          name: 'course'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-step {
  cursor: pointer;
}
</style>
