import {ajaxMsg} from "@/services/ajax";
import {
  GET_ALL_COURSETYPES,
  GET_COURSE_BY_TYPE,
  GET_Push_Courses
} from "@/conf/apis";
import {getImageBypath} from "./Common";

/**
 * 获取课程类别
 * 2022年1月12日
 */
async function getAllClassType() {
  return await ajaxMsg(GET_ALL_COURSETYPES,'GET')
}

/**
 * 获取某课程类别下的所有课程信息
 * 2022年1月13日
 * @param classtypeid
 */
async function getAllClassByType(classtypeid) {
  const param = new URLSearchParams();
  param.append('id', classtypeid)
  return normalizeClass(await ajaxMsg(GET_COURSE_BY_TYPE, 'GET', param));
}

function normalizeClass(classlist) {
  let ret = []
  for(let i =0;i < classlist.length;i++){
    const aclass={
      courseId:classlist[i].id,
      title:classlist[i].name,
      picture: classlist[i].pictureAddress,
      teacher: classlist[i].teacher.name,
    }
    //console.log(aclass.title,aclass.picture)
    getImageBypath(aclass.picture).then((res)=>{
      aclass.picture = res
    })
    ret.push(aclass)
  }
  return ret;
}

/**
 * 获取推送课程
 * 2022年1月13日
 */
async function getPushCourses() {
  return normalizePushClass(await ajaxMsg(GET_Push_Courses,'GET'))
}

function normalizePushClass(pushclasslist) {
  let ret = []
  for(let i =0;i < pushclasslist.length;i++){
    const aclass={
      courseId: pushclasslist[i].id,
      picture: pushclasslist[i].pictureAddress
    }
    getImageBypath(aclass.picture).then((res)=>{
      aclass.picture = res
    })
    ret.push(aclass)
  }
  return ret
}

export {
  getAllClassType,
  getAllClassByType,
  getPushCourses,
  normalizeClass
}
