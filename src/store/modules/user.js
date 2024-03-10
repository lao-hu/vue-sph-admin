// 引入登录|退出登录|获取用户信息的接口函数
import { login, logout, getInfo } from '@/api/user'
// 获取token|设置token|删除token的函数
import { getToken, setToken, removeToken } from '@/utils/auth'
// 路由模块当中重置路由的方法
import { resetRouter } from '@/router'

// 箭头函数
const getDefaultState = () => {
  return {
    //获取token
    token: getToken(),
    //存储用户名
    name: '',
    //存储用户头像
    avatar: '',
    //服务器返回的菜单信息【根据不同的角色：返回的标记信息，数组里面的元素是字符串】
    routes: [],
    //角色信息
    roles: [],
    //按钮权限的信息
    buttons: [],
  }
}


const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  //存储用户信息
  SET_USERINFO: (state, userInfo) => {
    //用户名
    state.name = userInfo.name;
    //用户头像
    state.avatar = userInfo.avatar;
    //菜单权限标记
    state.routes = userInfo.routes;
    //按钮权限标记
    state.buttons = userInfo.buttons;
    //角色
    state.roles = userInfo.roles;
  },
}

const actions = {
  // 用户登录 
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    // 这里
    const result = await login({ username: username.trim(), password: password })

    // 有些服务器状态码是200 或20000 
    if (result.code === 200 || result.code === 20000) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },

  // 获取用户信息
  async getInfo({ commit, state }) {
    const result = await getInfo(state.token)
    // 有些服务器状态码是200 或20000 
    if (result.code === 200 || result.code === 20000) {
     
      const { data } = result

      if (!data) {
        return Promise.reject(new Error('验证失败，请重新登录.'))
      }

      const { name, avatar } = data

      commit('SET_NAME', name)
      commit('SET_AVATAR', avatar)
      commit('SET_USERINFO', data)
    } else {
      return Promise.reject(new Error('faile'))
    }
  },

  // 用户退出登录
  async logout({ commit, state }) {
    const result = await logout(state.token)
    // 有些服务器状态码是200 或20000 
    if (result.code === 200 || result.code === 20000) {
      removeToken() // 必须先删除令牌
      resetRouter()
      commit('RESET_STATE')
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

