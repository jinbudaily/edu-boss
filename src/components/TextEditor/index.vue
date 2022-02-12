<template>
  <div class="text-editor" ref="editor"></div>
</template>

<script>
import E from 'wangeditor'
import { uploadCourseImage } from '@/services/course.js'
export default {
  name: 'TextEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      editor: null,
      // 数据是否已经加载过了（监听器只在第一次生效）
      isLoaded: false
    }
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    initEditor () {
      const editor = new E(this.$refs.editor)
      // 创建文本编辑器之前，进行事件设置
      // 触发ochange，改变绑定的内容
      // 是一个html格式的字符串
      editor.config.onchange = value => {
        this.$emit('input', value)
      }
      // 配置自定义图片上传功能
      editor.config.customUploadImg = async function (resultFiles, insertImgFn) {
        const fd = new FormData()
        // 键名是file
        fd.append('file', resultFiles[0])
        const { data } = await uploadCourseImage(fd)
        if (data.code === '000000') {
          // 通过insertImgFn传给富文本编辑器进行显示
          insertImgFn(data.data.name)
        }
      }
      editor.create()
      // 显示可能存在的初始内容
      editor.txt.html(this.value)
      // 把editor保存给this
      this.editor = editor
    }
  },
  watch: {
    value () {
      if (!this.isLoaded) {
        // 得到了加载的新数据，设置给文本编辑器
        this.editor.txt.html(this.value)
        this.isLoaded = true
      }
    }
  }
}
</script>

<style>
</style>
