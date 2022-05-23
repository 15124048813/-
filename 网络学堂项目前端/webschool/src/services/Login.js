import {ajaxLogin, ajaxMsg} from "@/services/ajax";
import {GET_ADMIN_INTERCEPT_VERIFICATION, POST_ADMIN_LGOIN, GET_USER_INTERCEPT_VERIFICATION, POST_USER_LGOIN} from "@/conf/apis";



/**
 * 用户登录
 * 2022年1月14日19:02
 */
async function userLogin(account,password){
  const param = new URLSearchParams();
  param.append('username',account);
  param.append('password',password);
  return await ajaxLogin(POST_USER_LGOIN,'POST',param)
}

/**
 * 用户token校验
 * 2022年1月14日19:02
 */
async function inspectUserToken(){
  return await ajaxMsg(GET_USER_INTERCEPT_VERIFICATION,'GET')
}

/**
 * 管理员token校验
 * 2022年1月14日19:02
 */
async function inspectAdminToken(){
  return await ajaxMsg(GET_ADMIN_INTERCEPT_VERIFICATION,'GET')
}


/**
 * 管理员登录
 * 2022年1月14日19:02
 */
async function adminLogin(account,password){
  const param = new URLSearchParams();
  param.append('username',account);
  param.append('password',password);
  return await ajaxLogin(POST_ADMIN_LGOIN,'POST',param)
}


export {
  userLogin,
  inspectUserToken,
  adminLogin,
  inspectAdminToken,

}
