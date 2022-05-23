/**
 * @description ajax 工具封装
 *
 */
import store from '../store'
import axios from 'axios'
import {Message} from "element-ui";

/**
 * 统一处理get
 * 2022年1月14日23:04:21
 * @param res
 * @param method
 * @returns {*}
 */
function resHandler (res = {},method = '') {
  const resData = res.data || {}
  if(resData.code!==null&&resData.code!==undefined){
    if(resData.code===404){
      Message.error("404")
    }
    else if(resData.code===200){
      if(method==='GET')
        return resData.data
      else if(resData.data){
        if(resData.data.length)
          return resData.data
        else if(resData.data.courseId||resData.data.chapterId)
          return resData.data
        else
          return true
      }
     else return true
    }
  }
  //return false
  Message.error('错误!')
  throw Error(`错误码： ${resData.errno} \n错误信息：${resData.message}`)
}

/**
 * 发送axios请求
 * @param {String} url url
 * @param {Object} params url 参数
 * @param {String} method url 方法
 * @param {String} responseType
 */
async function ajaxMsg(url='',method='',params={},responseType=''){
  if(!url||!method) return
  try{
    if(method === 'POST'||method==='PUT'){
      const res = await axios({url:url,data:params,method:method,responseType:responseType,
        headers:{Authorization:sessionStorage.getItem('tokenValue'),'Content-Type':'application/json'}})
      return resHandler(res)
    }
    else if(method==='DELETE'||method==='GET'){
      const res = await axios({url:url,params:params,method:method,responseType:responseType,
        headers:{Authorization:sessionStorage.getItem('tokenValue'),'Content-Type':'application/x-www-form-urlencoded'}})
      return resHandler(res,method)
    }
    else {
      const res = await axios({url:url,params:params,method:method.toUpperCase(),responseType:responseType,
        headers:{Authorization:sessionStorage.getItem('tokenValue'),'Content-Type':'application/x-www-form-urlencoded'}})
      return resHandler(res)
    }
  }catch (err){
    throw Error(err)
  }
}

/**
 * 登录请求
 * 2022年1月14日22:41:31
 * @param url
 * @param method
 * @param data
 */
async function ajaxLogin(url='',method='',data={}){
  if(!url||!method) return
  try {
    const res = await axios({url:url,method:method,data:data})
    return res.data
  }catch (err){
    throw Error(err)
  }
}

/**
 * 文件流请求
 * 2022年1月14日18:21:34
 * @param url
 * @param method
 * @param data
 * @param param
 * @param responseType
 * @param type
 * @param config
 */
async function ajaxFile(url='',method='',data={},param={},responseType='blob',type='application/x-www-form-urlencoded',config={}){
  if(!url||!method) return
  try {
    const res = await axios({url:url,method:method,data:data,params:param,config:config,
      responseType:responseType, headers:{Authorization:sessionStorage.getItem('tokenValue'),'Content-Type':type}})
    return res.data
  }catch (err){
    throw Error(err)
  }
}

export {
  ajaxMsg,
  ajaxFile,
  ajaxLogin
}
