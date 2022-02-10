import request from '@/utils/request.js'

// 获取编辑菜单页面信息
// 默认传递-1，获取上级菜单信息
export const getEditMenuInfo = (id = -1) => {
  return request({
    method: 'GET',
    // url: `/boss/menu/getEditMenuInfo?id=${id}`,
    url: '/boss/menu/getEditMenuInfo',
    // GET的参数是是params,post的参数是data
    params: {
      id
    }
  })
}
// 编辑或新增菜单
export const createOrUpdateMenu = data => {
  return request({
    method: 'POST',
    url: '/boss/menu/saveOrUpdate',
    data
  })
}

// 获取所有菜单
export const getAllMenus = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getAll'
  })
}

// 删除菜单
// 请求数据类型application/x-www-form-urlencoded
export const deleteMenu = id => {
  return request({
    method: 'DELETE',
    url: `/boss/menu/${id}`
  })
}
// 获取所有菜单并按照层级展示
export const getMenuNodeList = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getMenuNodeList'
  })
}
// 给角色分配菜单
export const allocateRoleMenus = data => {
  return request({
    method: 'POST',
    url: '/boss/menu/allocateRoleMenus',
    data
  })
}
// 获取当前角色拥有的菜单列表接口
export const getRoleMenus = roleId => {
  return request({
    method: 'GET',
    url: '/boss/menu/getRoleMenus',
    params: {
      roleId
    }
  })
}
