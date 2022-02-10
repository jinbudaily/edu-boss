import request from '@/utils/request.js'

// 获取角色 getRolePages
export const getRolePages = data => {
  return request({
    method: 'POST',
    url: '/boss/role/getRolePages',
    data
  })
}
// 删除角色
export const deleteRole = id => {
  return request({
    method: 'DELETE',
    url: `/boss/role/${id}`
  })
}

// 新增角色
export const createOrUpdateRole = data => {
  return request({
    method: 'POST',
    url: '/boss/role/saveOrUpdate',
    data
  })
}

// 获取角色
export const getRoleById = id => {
  return request({
    method: 'GET',
    url: `/boss/role/${id}`
  })
}

// 给用户分配角色
export const allocateUserRoles = data => {
  return request({
    method: 'POST',
    url: '/boss/role/allocateUserRoles',
    data
  })
}

// 获取所有角色
export const getAllRoles = () => {
  return request({
    method: 'GET',
    url: '/boss/role/all'
  })
}
// 获取用户已经分配角色
export const getUserRoles = userId => {
  return request({
    method: 'GET',
    url: `/boss/role/user/${userId}`
  })
}
