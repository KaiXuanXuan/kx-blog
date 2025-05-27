import request from '@/utils/request'

// 注册
const register = (data) => {
  return request({
    url: '/user/register',
    method: 'post',
    data: data,
  })
}

// 登录
const login = (data) => {
  return request({
    url: '/user/login',
    method: 'post',
    data: data,
  })
}

// 修改密码
const updatePassword = (data) => {
  return request({
    url: '/user/updatePassword',
    method: 'post',
    data: data,
  })
}

export { register, login, updatePassword }