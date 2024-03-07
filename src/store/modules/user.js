import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
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
  }
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

