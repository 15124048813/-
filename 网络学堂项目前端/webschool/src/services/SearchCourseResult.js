import {ajaxMsg} from "@/services/ajax";
import {
  GET_COURSES_SEARCH2,
  GET_COURSE_BY_TEACHER_NAME2,
  GET_COURSE_BY_TYPE,
  SEARCH_COURSE_UPLOAD_TIME,
  SEARCH_COURSE_COLLECTION_COUNT,
  SEARCH_COURSE_VIDEO_LENGTH
} from "@/conf/apis";

/**
 * 根据课程名字搜索课程
 * 2022年1月14日
 */
async function searchCourseByCourseName(coursename) {
  const param = new URLSearchParams();
  param.append('name', coursename)
  return await ajaxMsg(GET_COURSES_SEARCH2,'GET',param)
}

/**
 * 根据讲师名字搜索课程
 * 2022年1月14日
 */
async function searchCourseByTeacherName(teachername) {
  const param = new URLSearchParams();
  param.append('name', teachername)
  return await ajaxMsg(GET_COURSE_BY_TEACHER_NAME2,'GET',param)
}
async function searchCourseByType(typeid){
  const param = new URLSearchParams()
  param.append('id', typeid)
  return await ajaxMsg(GET_COURSE_BY_TYPE, 'GET', param)
}

async function searchCourseUploadTime(courseidlist){
  const param = new URLSearchParams()
  param.append('courseIdList', courseidlist)
  return await ajaxMsg(SEARCH_COURSE_UPLOAD_TIME, 'GET', param)
}
async function searchCollectionCount(courseidlist){
  const param = new URLSearchParams()
  param.append('courseIdList', courseidlist)
  return await ajaxMsg(SEARCH_COURSE_COLLECTION_COUNT, 'GET', param)
}

async function searchVideoLength(courseidlist){
  const param = new URLSearchParams()
  param.append('courseIdList', courseidlist)
  return await ajaxMsg(SEARCH_COURSE_VIDEO_LENGTH, 'GET', param)
}

export {
  searchCourseByCourseName,
  searchCourseByTeacherName,
  searchCourseByType,
  searchCourseUploadTime,
  searchCollectionCount,
  searchVideoLength
}
