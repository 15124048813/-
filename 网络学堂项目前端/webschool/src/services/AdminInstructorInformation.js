import {ajaxMsg} from "@/services/ajax";
import {
  PUT_ADD_TEACHER,
  PUT_UPDATA_TEACHER,
  DELETE_TEACHER,
  GET_ALL_TEACHER_PAGE,
  GET_SEACHER_TEACHERS_PAGE
} from "@/conf/apis";

/**
 * 删除讲师
 * 2022年1月12日09:44:12
 * @param tid
 */
async function deleteTeacher(tid) {
  const param = new URLSearchParams()
  param.append('id', tid)
  return await ajaxMsg(DELETE_TEACHER,'DELETE',param)
}

/**
 * 增加讲师
 * 2022年1月12日10:12:36
 * @param insertfrom
 */
async function insertData(insertfrom) {
  const data={
    'name':insertfrom.teachername,
    'photoAddress':insertfrom.photoAddress,
    'introduction':insertfrom.teacherIntroduction
  }
  return await ajaxMsg(PUT_ADD_TEACHER,'POST',data)
}

/**
 * 更新输入框信息
 * 2022年1月12日10:24:39
 * @param tableData 对应的每个值
 */
function updataInput(tableData=null){
  if(tableData===null){
    return{
      teacherdata:'',
      teachername:'',
      teacherIntroduction: '',
      photoAddress:''
    }
  }
  try{
    return {
      teacherdata:tableData.teacherdata,
      teachername:tableData.teachername,
      teacherIntroduction: tableData.teacherIntroduction,
      photoAddress:tableData.photoAddress
    }
  }catch (err){
    throw Error(err)
  }
}

/**
 * 查询所有讲师
 * 2022年1月12日10:30:01
 * @param page
 * @param count
 */
async function getAllTeachers(page,count) {
  const param = new URLSearchParams()
  param.append('page',page)
  param.append('count',count)
  return normalizeTeacher(await ajaxMsg(GET_ALL_TEACHER_PAGE,'GET',param))
}

/**
 * 查询讲师按信息
 * 2022年1月12日10:34:03
 * @param searchInput 搜索信息框
 * @param page
 * @param count
 */
async function searchTeacher(searchInput,page,count) {
  if (searchInput === '') {
    return await getAllTeachers(page,count)
  }
  const param = new URLSearchParams();
  param.append('name', searchInput)
  param.append('page',page)
  param.append('count',count)
  return normalizeTeacher(await ajaxMsg(GET_SEACHER_TEACHERS_PAGE,'GET',param))
}

/**
 * 规范化输出
 * 2022年1月12日11:48:42
 * @param data
 */
function normalizeTeacher(data){
  try {
    var res = {teacherList:[],pageCount:data.count}
    for(var i =0;i<data.teacherList.length;i++){
      const teacher={
        teacherdata: Number(data.teacherList[i].id),
        teachername: data.teacherList[i].name,
        teacherIntroduction:data.teacherList[i].introduction,
        photoAddress:data.teacherList[i].photoAddress,
      }
      res.teacherList.push(teacher)
    }
    return res
  }catch (err){
    throw Error(err)
  }
}

/**
 * 修改讲师信息
 * 2022年1月12日10:37:28
 * @param insertfrom 新数据
 * @param insertfromOld 旧数据
 */
async function updataTeacherMsg(insertfrom, insertfromOld) {
  var data={id:insertfrom.teacherdata}
  //if (insertfrom.teachername !== insertfromOld.teachername)
    data.name=insertfrom.teachername
  //if (insertfrom.teacherIntroduction !== insertfromOld.teacherIntroduction)
    data.introduction=insertfrom.teacherIntroduction
  //if (insertfrom.photoAddress !== insertfromOld.photoAddress)
    data.photoAddress=insertfrom.photoAddress
  return await ajaxMsg(PUT_UPDATA_TEACHER,'PUT',data)
}

export {
  updataTeacherMsg,
  searchTeacher,
  getAllTeachers,
  updataInput,
  insertData,
  deleteTeacher,
}
