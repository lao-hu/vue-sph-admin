// 引入 vue 
import Vue from 'vue'
// 引入 Vuex
import Vuex from 'vuex'

import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

import home from './modules/home';
// 安装Vuex
Vue.use(Vuex)

// 暴露store 
const store = new Vuex.Store({
  /* 
    modules:
        为了避免在一个复杂的项目 state 中的数据变得臃肿，
        Vuex 允许将 Store 分成不同的模块，
        每个模块都有属于自己的 state，getter，action，mutation
    */
  modules: {
    app,
    settings,
    user,
    home
  },
  getters
})

export default store
