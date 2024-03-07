//
import mockRequest from '@/utils/mockRequest'

/*准备 actions---用于响应组件中的动作
commit参数采用解构赋值
*/ 
const actions = {
    async getData({commit}){
       const result = await mockRequest.get("/home/list")
       if(result.code === 20000){
        commit("GETDATA",result.data)
       }

    }
}
// 准备 mutations---用于操作数据(state)
const mutations = {
    GETDATA(state,data){
      state.list = data
    }
}


// 准备 state---用于存储数据
/* 
state 数据默认值别瞎写, 服务器返回的数组，默认值就是数组，服务器返回的是对象，默认值就是对象
*/
const state = {
    list:{}
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
