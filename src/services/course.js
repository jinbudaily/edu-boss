import request from '@/utils/request.js'

// 分页查询课程信息
export const getQueryCourses = data => {
  return request({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data
  })
}

// 课程上下架
export const changeState = params => {
  return request({
    method: 'GET',
    url: '/boss/course/changeState',
    params
  })
}

// 保存或者更新课程信息
export const saveOrUpdateCourse = data => {
  return request({
    method: 'POST',
    url: '/boss/course/saveOrUpdateCourse',
    data
  })
}

// 上传图片
// multipart/form-data
// data应该为formData对象
export const uploadCourseImage = (data, onUploadProgress) => {
  return request({
    method: 'POST',
    url: '/boss/course/upload',
    data,
    onUploadProgress
    /*
    // onUploadProgress 用于检测上传进度
    onUploadProgress (event) {
      console.log(event.total, event.loaded)
    }
    */
  })
}
