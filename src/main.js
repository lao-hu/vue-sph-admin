// 引入 vue
import Vue from 'vue'

import 'normalize.css/normalize.css' // CSS重置的现代替代方案

// 引入全部的element-ui
//  注意：当前 element ui 版本为 2.13.2，文档请选择其对应的版本
import ElementUI from 'element-ui'

// 引入element-ui 样式 ，
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // 全局CSS

// App 根组件
import App from './App'
// 引入 vuex配置
import store from './store'
// 引入 VueRoute
import router from './router'

import '@/icons' // icon
import '@/permission' // 权限控制

// 全局组件
import CategorySelect from '@/components/CategorySelect'
Vue.component(CategorySelect.name, CategorySelect)
/**
* 如果您不想使用mock服务器
* 您想将MockJs用于mock-api
* 可以执行：mockXHR（）
*
* 目前MockJ将用于生产环境中，
* 请在联机前将其删除！
*/
/* 
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
*/
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI) 

Vue.config.productionTip = false
// 引入相关API接口请求
import api from '@/api'
// 在原型上面添加 api 请求，就可以所有组件上任意使用
Vue.prototype.$api = api
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
