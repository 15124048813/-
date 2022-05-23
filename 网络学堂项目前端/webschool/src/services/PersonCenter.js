/**
 * 个人中心组件
 * 2022年1月12日20:50:06
 */
import {ajaxMsg} from "@/services/ajax";
import {
  GET_STUDENT_COLLECTIONLIST,
  GET_STUDENT_COLLECTIONLIST_PAGE,
  GET_STUDENT_HISTORY,
  GET_STUDENT_HISTORY_PAGE,
  GET_STUDENT_INFORMATION, SEARCH_HISTORY_PAGE,
  UPDATE_STUDENT_INFORMATION, UPDATE_STUDENT_PASSWORD
} from "@/conf/apis";
import {formatSeconds} from "@/services/Common";

/**
 * 获取个人信息
 * 2022年1月12日20:50:56
 * @param id 用户id
 */
async function getPersonInformation(id){
  const param = new URLSearchParams()
  param.append('id',id)
  return normalizePerson(await ajaxMsg(GET_STUDENT_INFORMATION,'GET',param))
}

/**
 * 规范化个人信息输出
 * 2022年1月13日11:00:10
 * @param data
 */
async function normalizePerson(data) {
  try {
    return{
      name:data.name,
      sex:data.sex===1 ? '男':'女',
      username:data.username,
      mail:data.email,
      phone:data.phone,
      password:data.password,
      photoAdress:data.photoAddress
    }
  }catch (err){
    throw Error(err)
  }
}

/**
 * 获取收藏列表
 * 2022年1月12日20:55:47
 * @param sid
 */
async function getCollectionList(sid){
  const param = new URLSearchParams()
  param.append('id',sid)
  return await ajaxMsg(GET_STUDENT_COLLECTIONLIST,'GET',param)
}

/**
 * 获取收藏列表分页
 * 2022年1月13日00:49:38
 * @param sid
 * @param page
 * @param count
 */
async function getCollectionListPage(sid,page,count){
  const param = new URLSearchParams()
  param.append('id',sid)
  param.append('page',page)
  param.append('count',count)
  return await ajaxMsg(GET_STUDENT_COLLECTIONLIST_PAGE, 'GET', param)
}

/**
 * 获取历史记录
 * 2022年1月12日21:30:47
 * @param sid
 */
async function getHistory(sid){
  const param = new URLSearchParams()
  param.append('id',sid)
  return await ajaxMsg(GET_STUDENT_HISTORY,'GET',param)
}

/**
 * 获取历史记录 分页
 * 2022年1月12日21:34:28
 * @param sid
 * @param page
 * @param count
 */
async function getHistoryPage(sid,page,count){
  const param = new URLSearchParams()
  param.append('id',sid)
  param.append('page',page)
  param.append('count',count)
  return normalizeHistory(await ajaxMsg(GET_STUDENT_HISTORY_PAGE,'GET',param))
}

/**
 * 搜索历史记录 分页
 * 2022年1月14日12:10:45
 * @param searchInput
 * @param sid
 * @param page
 * @param count
 * @param beginDate
 * @param endDate
 */
async function searchHistoryPage(searchInput='',sid,page,count,beginDate=Date("Tue Jan 01 2000 00:00:00 GMT+0800"),endDate=Date(null)){
  try {
    const param = new URLSearchParams()
    param.append('name',searchInput)
    param.append('id',sid)
    param.append('page',page)
    param.append('count',count)
    if(beginDate!=='')
      param.append('begin',beginDate)
    else{
      param.append('begin',new Date("October 13, 1975 11:13:00"))
    }
    if(endDate!=='')
      param.append('end',endDate)
    else
      param.append('end',Date(null))
    return normalizeHistory(await ajaxMsg(SEARCH_HISTORY_PAGE,'GET',param))
  }catch(err){
    throw Error(err)
  }
}

/**
 * 规范化输出历史记录 新增时长大于0判断
 * 2022年1月13日01:10:19
 * @param data
 */
function normalizeHistory(data){
  try {
    const res = {studentCourseTimeList: [], count: data.count};
    if(data.count>0){
      for(let i = 0; i<data.studentCourseTimeList.length; i++){
        if(data.studentCourseTimeList[i].time>-1)
          res.studentCourseTimeList.push({
            lastWatchDate:data.studentCourseTimeList[i].lastWatchDate,
            course:data.studentCourseTimeList[i].course.name,
            time:formatSeconds(data.studentCourseTimeList[i].time)
          })
        else
          res.count--
      }
    }
    return res
  }catch (err){
    throw Error(err)
  }
}

/**
 * 修改个人信息
 * 2022年1月13日12:15:13
 * @param sid
 * @param user
 */
async function updatePersonInformation(sid,user){
  // const param = new URLSearchParams()
  // param.append('id',sid)
  // param.append('name',user.name)
  // param.append('sex',user.sex==='男'?1:0)
  // param.append('email',user.mail)
  // param.append('phone',user.phone)
  const data={
    id:sid,
    name:user.name,
    sex:user.sex==='男'?1:0,
    email:user.mail,
    phone:user.phone
  }
  return await ajaxMsg(UPDATE_STUDENT_INFORMATION,'PUT',data)
}

/**
 * 修改密码
 * 2022年1月13日18:11:21
 * @param sid
 * @param oldPassword
 * @param newPassword
 */
async function updataPassword(sid,oldPassword,newPassword){
  // console.log({sid,oldPassword,newPassword})
  const param = new URLSearchParams()
  param.append('id',sid)
  param.append('oldPassword',oldPassword)
  param.append('newPassword',newPassword)
  //param.append('student',{id:sid,oldPassword:oldPassword,newPassword:newPassword})
  return await ajaxMsg(UPDATE_STUDENT_PASSWORD,'put',param)
}

/**
 * 头像上传   api没填
 * 2022年1月17日20:00:00
 * @param sid
 * @param image
 */
async function uploadStudentPhoto(sid,image){
  return await ajaxMsg(UPDATE_STUDENT_INFORMATION,'PUT',{id:sid,photoAddress:image})
}

export {
  getHistoryPage,
  getPersonInformation,
  getCollectionList,
  getCollectionListPage,
  updatePersonInformation,
  updataPassword,searchHistoryPage,
  uploadStudentPhoto
}
