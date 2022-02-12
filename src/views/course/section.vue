<template>
  <div class="course-section">
    <el-card>
      <div slot="header">
        课程名称
      </div>
      <el-tree
        :data="sections"
        :props="defaultProps"
        draggable
        :allow-drop="handleAllowDrop"
        @node-drop="handleNodeDrop"
        v-loading="isLoading">
        <div class="inner" slot-scope="{ node, data }">
          <span>{{ node.label}}</span>
          <span v-if="data.sectionName" class="action">
            <el-button>编辑</el-button>
            <el-button type="primary">添加课时</el-button>
            <el-button>状态</el-button>
          </span>
          <span v-else class="actions">
            <el-button>编辑</el-button>
            <el-button
            type="success"
            @click="$router.push({
              name: 'course-video',
              params: {
                courseId
              },
              query: {
                lessonId: data.id
              }
            })">上传视频</el-button>
            <el-button>状态</el-button>
          </span>
        </div>
      </el-tree>
    </el-card>
  </div>
</template>

<script>
import { getSectionAndLesson, saveOrUpdateSection, saveOrUpdateLesson } from '@/services/section'

export default {
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        label (data) {
          return data.sectionName || data.theme
        }
      },
      isLoading: false
    }
  },
  created () {
    this.loadSection()
  },
  methods: {
    async loadSection () {
      const { data } = await getSectionAndLesson(this.courseId)
      if (data.code === '000000') {
        this.sections = data.data
      }
    },
    // 拖拽处理操作，只允许同级拖拽
    handleAllowDrop (draggingNode, dropNode, type) {
      // 规则1：只能同级移动，type不能是'inner' type !== 'inner'
      // 规则2: 课时不能移动到其他章节中
      return type !== 'inner' && draggingNode.data.sectionId === dropNode.data.sectionId
    },
    // 拖拽成功保存数据
    async handleNodeDrop (draggingNode, dropNode, type, event) {
      this.isLoading = true
      // 由于有很多章节与课时，需要给每个章节与课时都进行最新的排序顺序的请求
      try {
        // 父节点的子节点就是同级节点
        // promise.all进行批量的异步处理
        await Promise.all(dropNode.parent.childNodes.map((item, index) => {
          // 判断当前是章节还是课时，再给对应的接口发送请求
          if (draggingNode.data.lessonDTOS) {
            // 章节接口处理
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index
            })
          } else {
            // 课时接口处理
            return saveOrUpdateLesson({
              id: item.data.id,
              orderNum: index
            })
          }
        }))
        this.$message.success('数据更新成功')
      } catch (err) {
        this.$message.error('数据更新失败', err)
      }
      this.isLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.inner {
  // 浏览器观察到父元素设置了 flex，所以当前元素 flex: 1 占满一行
  flex: 1;
  // 内部元素希望左右分开，所以给当前元素设置 flex
  display: flex;
  justify-content: space-between;
  align-items: center;
  // 其他样式美化
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
}

// 当前行具有类名 .el-tree-node__content 设置了固定高度 26px, 这里要改为 auto 自适应
// 由于为 Tree 组件内的元素，需要设置样式穿透
::v-deep .el-tree-node__content {
  height: auto;
}
</style>
