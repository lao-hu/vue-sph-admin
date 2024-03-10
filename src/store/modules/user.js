// 引入登录|退出登录|获取用户信息的接口函数
import { login, logout, getInfo } from '@/api/user'
// 获取token|设置token|删除token的函数
import { getToken, setToken, removeToken } from '@/utils/auth'
// 路由模块当中重置路由的方法
import { resetRouter,asyncRoutes } from '@/router'

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
    //按钮权限的信息, 
    buttons: [],
    // 对比之后，【项目已经有点异步的路由，与服务器返回的标记信息进行对比，筛选出最终需要展示的 】
    resultAsyncRoutes:[]
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
  // 最终计算的路由
  SET_RESULTASYNCROUTES:(state,data)=>{
    state.resultAsyncRoutes = data
  }
}

// 定义一个函数 ，两个数组进行对比，对比出，当前用户显示哪些异步路由
function computedAsyncRoutes(asRoutes,dataRoutes){
    asRoutes.filter((params) => {
      console.log(params);
    })

    
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
      console.log(result)
      const { data } = result
      commit('SET_USERINFO', data)
      commit('SET_RESULTASYNCROUTES',computedAsyncRoutes(asyncRoutes,data.routes))
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

