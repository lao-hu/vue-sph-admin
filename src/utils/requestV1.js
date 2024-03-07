import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 我自己定义的接口实例
// process 对象是一个全局变量，process.env 属性会返回包含用户环境的对象
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API1, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在提出要求之前做点什么

    if (store.getters.token) {
      // 让每个请求携带令牌
      // ['token']是一个自定义头密钥
      // 请根据实际情况进行修改
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // 处理请求错误
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
  * 如果您想获取http信息，如标头或状态
  * 请返回响应=>响应 
  */

  /**
  * 通过自定义代码确定请求状态
  * 这里只是一个例子
  * 您也可以通过HTTP状态代码来判断状态
  */
  response => {
    
    const res = response.data

    // 如果自定义代码不是200，则判断为错误。
    // 有些 接口 状态码是 200 或者是 20000
    if (res.code !== 20000 && res.code !== 200) {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('您已退出登录，您可以取消以留在此页面，也可以重新登录', '确认退出登录', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    // console.log('err' + error) // for debug
    if (error.response) {
      // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // 请求已经成功发起，但没有收到响应
      // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
      // 而在node.js中是 http.ClientRequest 的实例
      console.log(error.request);
    } else {
      // 发送请求时出了点问题
      console.log('Error', error.message);
    }
    console.log(error.config);
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
