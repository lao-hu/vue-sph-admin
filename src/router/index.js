import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * 注意：子菜单仅在路由子项时显示。长度>=1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   如果设置为true，项目将不会显示在侧边栏中（默认为false）
 * alwaysShow: true               如果设置为true，将始终显示根菜单
 *                                如果不设置alwaysShow，当项目有多个子路由时，
 *                                它将变为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置noRedirect，则面包屑中不会重定向
 * name:'router-name'             该名称由＜keep-alive＞使用（必须设置！！！）
 * meta : {
    roles: ['admin','editor']    控制页面角色（可以设置多个角色）
    title: 'title'               侧边栏和breadcrumb中显示的名称（推荐集）
    icon: 'svg-name'/'el-icon-x' 图标显示在侧边栏中
    breadcrumb: false            如果设置为false，则该项将隐藏在breadcrumb中（默认值为true）
    activeMenu: '/example/list'  如果设置了路径，侧边栏将突出显示您设置的路径
  }
 */

/**
 * constantRoutes
 * 没有权限要求的基页
 * 所有角色都可以访问
 */
export const constantRoutes = [
  {
    // 登录页面
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    // 404
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    // 首页
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    // 权限管理
    path: '/acl',
    name:'acl',
    component:Layout,
    meta:{
      title:"权限管理",
      icon:'el-icon-lock'
    },
    // 子路由
    children:[
      { 
        // 用户管理
        path: '/user',
        // 路由懒加载
        component: () => import('@/views/acl/user'),
        name: 'user',
        meta: {
          title: '用户管理',
          icon: 'el-icon-folder'
        }
      },
      { 
        // 用户管理
        path: '/role',
        // 路由懒加载
        component: () => import('@/views/acl/role'),
        name: 'role',
        meta: {
          title: '角色管理',
          icon: 'el-icon-folder'
        }
      },
      {
        // 用户管理
        path: '/premission',
        // 路由懒加载
        component: () => import('@/views/acl/premission'),
        name: 'premission',
        meta: {
          title: '菜单管理',
          icon: 'el-icon-folder'
        }
      }
    ]
  },
  {
    // 商品管理
    path: '/product',
    component: Layout,
    name: 'Product',
    meta: {
      title: '商品管理',
      icon: 'el-icon-s-goods'
    },
    // 子路由
    children: [
      { 
        // 品牌管理
        path: '/trademake',
        // 路由懒加载
        component: () => import('@/views/product/trademake'),
        name: 'TradeMake',
        meta: {
          title: '品牌管理',
          icon: 'el-icon-folder'
        }
      },
      {
        // 平台属性管理
        path: '/attr',
        // 路由懒加载
        component: () => import('@/views/product/attr'),
        name: 'Attr',
        meta: {
          title: '平台属性管理',
          icon: 'el-icon-folder'
        }
      },
      {
        // spu
        path: '/spu',
        // 路由懒加载
        component: () => import('@/views/product/spu'),
        name: 'Spu',
        meta: {
          title: 'spu管理',
          icon: 'el-icon-folder'
        }
      },
      {
        // sku
        path: '/sku',
        // 路由懒加载
        component: () => import('@/views/product/sku'),
        name: 'Sku',
        meta: {
          title: 'sku管理',
          icon: 'el-icon-folder'
        }
      }
    ]
  },
  // 404页必须放在末尾！！！
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // 模式：'历史'，// 需要服务支持
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
