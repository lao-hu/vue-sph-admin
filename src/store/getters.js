/* 
  准备 getters -- 用于将state进行加工,并且需要组件间复用时可以使用
  相当于跨组件的 computed 计算属性，
  主要作用就是：为了简化数据而生的
*/
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // 用户token
  token: state => state.user.token,
  // 用户头像
  avatar: state => state.user.avatar,
  // 用户名称
  name: state => state.user.name
}
export default getters
