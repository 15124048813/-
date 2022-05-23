import {ajaxMsg} from "@/services/ajax";
import {GET_ALL_STUDENT_TIEM, GET_STUDENT_TIME_BYNAME} from "@/conf/apis";
import ca from "element-ui/src/locale/lang/ca";
import {formatSeconds} from "@/services/Common";

/**
 * 获取全部学生的学习时长
 * 2022年1月12日18:50:18
 */
async function getAllStudentLearningTime(){
  return normalizeTime(await ajaxMsg(GET_ALL_STUDENT_TIEM,'GET'))
}

/**
 * 搜索学生信息时长
 * 2022年1月12日18:52:31
 * @param searchInput
 */
async function searchStudentLearningTime(searchInput){
  if(searchInput===''){
    return await getAllStudentLearningTime()
  }
  const param = new URLSearchParams()
  param.append('name',searchInput)
  return normalizeTime(await ajaxMsg(GET_STUDENT_TIME_BYNAME,'GET',param))
}

/**
 * 规范化时间
 * 2022年1月17日16:15:24
 * @param data
 */
function normalizeTime(data){

  const list = []
  try {
    for(let i = 0;i<data.length;i++){
      list.push({id:data[i].id,studentName:data[i].studentName,time:formatSeconds(data[i].time)})
    }
  }catch (err){
    throw Error(err)
  }
  return list
}

export {
  getAllStudentLearningTime,
  searchStudentLearningTime
}
