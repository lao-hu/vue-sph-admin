// 引入登录|退出登录|获取用户信息的接口函数
import { login, logout, getInfo } from '@/api/user'
// 获取token|设置token|删除token的函数
import { getToken, setToken, removeToken } from '@/utils/auth'
// 路由模块当中重置路由的方法
import { resetRouter,asyncRoutes,anyRoutes,constantRoutes} from '@/router'

// 引入路由配置文件
import router from '@/router';

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
    resultAsyncRoutes:[],
    // 最终用户需要展示的路由
    resultAllRoutes:[]
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
    // 保存当前用户的异步路由
    state.resultAsyncRoutes = data
    // 保存合并生成新的路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes,anyRoutes)
    // 给动态的添加新的路由规则 
    // 添加一条新路由规则。如果该路由规则有 name，并且已经存在一个与之相同的名字，则会覆盖它。
    router.addRoutes(state.resultAllRoutes)
  }
}

// 定义一个函数 ，两个数组进行对比，对比出，当前用户显示哪些异步路由
function computedAsyncRoutes(asRoutes,dataRoutes){
  // 过滤出当前用户需要展示的异步路由
 return  asRoutes.filter((item) => {
       // 判断数组中是否包含这个元素 
       if(dataRoutes.indexOf(item.name) != -1 ){
          
           //遍历子路由
           if(item.children && item.children.length != 0){
              item.children = computedAsyncRoutes(item.children,dataRoutes)
           }
           return true
       }
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

