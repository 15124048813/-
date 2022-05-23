import {ajaxMsg} from "@/services/ajax";
import {
  UPDATE_STUDENT_CHAPTER_TIME, ADD_STUDENT_COURSE_TIME,
  GET_CHAPTERLIST,
  GET_COURSE_INFORMATION,
  GET_STUDENT_CHAPTER_TIME,
  UPDATE_COLLECTION_COURSE,
  CHECK_STUDENT_COLLECTION, CHECK_CHAPTER_PLAY_DONE, GET_FILE, DOWNLOADPDF
} from "@/conf/apis";
import {ajaxFile} from "./ajax";

/**
 * 获取课程信息
 * 2022年1月12日19:30:20
 * @param cid
 */
async function getCourseMsgById(cid){
  const param = new URLSearchParams();
  param.append('id',cid)
  const course = await ajaxMsg(GET_COURSE_INFORMATION,'GET',param)
  const chapterList = await getChapterList(cid)
  return normalizeCourseInformation(course,chapterList);
}

/**
 * 获取章节列表   用不到？
 * 2022年1月12日19:38:22
 * @param cid
 */
async function getChapterList(cid){
  const param = new URLSearchParams();
  param.append('id',cid)
  return await ajaxMsg(GET_CHAPTERLIST,'GET',param)
}

/**
 * 规范化数据   用不到？
 * 2022年1月12日19:33:43
 * @param data
 * @param chapterList
 */
function normalizeCourseInformation(data,chapterList){
  try {
    return{
      course:data,
      chapterList:chapterList
    }
  }catch (err){
    throw Error(err)
  }
}

/**
 * 修改收藏状态
 * 2022年1月12日20:15:36
 * @param sid
 * @param cid
 */
async function updateCollection(sid,cid){
  const param = new URLSearchParams()
  param.append('studentId',sid)
  param.append('courseId',cid)
  return await ajaxMsg(UPDATE_COLLECTION_COURSE,'post',param)
}

/**
 * 获取收藏状态
 * 2022年1月14日13:03:36
 * @param sid
 * @param cid
 */
async function getCollectionStatus(sid,cid){
  const param = new URLSearchParams()
  param.append('studentId',sid)
  param.append('courseId',cid)
  return await  ajaxMsg(CHECK_STUDENT_COLLECTION,'GET',param)
}

/**
 * 获取章节播放时长
 * 2022年1月12日20:18:48
 * @param sid
 * @param chapterId
 */
async function getStudentChapterTime(sid,chapterId){
  const param = new URLSearchParams()
  param.append('studentId',sid)
  param.append('chapterId',chapterId)
  return await ajaxMsg(GET_STUDENT_CHAPTER_TIME,'GET',param)
}

/**
 * 更新章节播放时间
 * 2022年1月12日20:33:45
 * @param sid
 * @param chapterId
 * @param time
 */
async function updateChapterTime(sid,chapterId,time){
  const param = new URLSearchParams()
  param.append('studentId',sid)
  param.append('chapterId',chapterId)
  param.append('time',parseInt(time))
  return await ajaxMsg(UPDATE_STUDENT_CHAPTER_TIME,'post',param)
}

/**
 * 获取学生是否播放完毕
 * 2022年1月17日20:34:14
 * @param sid
 * @param chapterId
 */
async function checkPlayDone(sid,chapterId){
  const param = new URLSearchParams()
  param.append('studentId',sid)
  param.append('chapterId',chapterId)
  return await ajaxMsg(CHECK_CHAPTER_PLAY_DONE,'GET',param)
}

// /**
//  * 更新课程时长
//  * 2022年1月14日21:37:48
//  * @param sid
//  * @param cid
//  * @param time
//  */
// async function updateCourseTime(sid,cid,time){
//   const param = new URLSearchParams()
//   param.append('studentId',sid)
//   param.append('chapterId',chapterId)
//   param.append('time',time)
//   return await ajaxMsg(ADD_STUDENT_COURSE_TIME,'post',param)
// }

/**
 * 下载课件 待优化
 * 2022年1月18日09:49:39
 * @param sid
 * @param pdfName
 * @param path
 */
async function downloadFile(sid,pdfName,path) {
  if(path==='')
    return null
  const param = new URLSearchParams()
  param.append('studentId',sid)
  param.append('fileName',path)
  try {

  const res = await ajaxFile(DOWNLOADPDF,'GET',{},param)
  const blob = new Blob([res])
  const fileName = pdfName + '.pdf'
  if ('download' in document.createElement('a')) { // 支持a标签download的浏览器
    const link = document.createElement('a') // 创建a标签
    link.download = fileName // a标签添加属性
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    document.body.appendChild(link)
    link.click() // 执行下载
    URL.revokeObjectURL(link.href) // 释放url
    document.body.removeChild(link) // 释放标签
   }
  }catch (err) {
    throw Error(err)
  }
    // else { // 其他浏览器
  //   window.Navigator.msSaveBlob(blob, fileName)
  // }
}

export{
  getCourseMsgById,
  updateChapterTime,
  //updateCourseTime,
  updateCollection,
  getCollectionStatus,
  getStudentChapterTime,
  checkPlayDone,
  downloadFile
}
