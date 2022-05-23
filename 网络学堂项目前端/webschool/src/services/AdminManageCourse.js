import {ajaxFile, ajaxMsg} from "@/services/ajax";
import {
  GET_ALL_COURSES,
  GET_COURSES_SEARCH,
  PUT_UPDATA_COURSE,
  POST_ADD_CHAPTER,
  PUT_UPDATA_CHAPTER,
  DELETE_CHAPTER,
  GET_CHEACK_PUSH_COURSE,
  GET_ALL_TEACHERS,
  GET_ALL_COURSETYPES,
  GET_CHAPTERLIST,
  DELETE_COURSE,
  UPLOAD_COURSE,
  SET_ADD_PUSH,
  SET_REMOVE_PUSH, UPLOAD_CHPATER_VIDEO, GET_FILE
} from "@/conf/apis";

/**
 * 上传课程
 * 2022年1月11日20:23:36
 * @param insertform
 * @param chapterList
 */
async function uploadCourse(insertform,chapterList){
  return new Promise(async function (resolve) {
    let correct
    try {
      const course = {
        name: insertform.courseName,
        teacher: {id: spiltId(insertform.teacher)},
        courseType: {id: spiltId(insertform.courseType)},
        target: insertform.courseIntroduction.target,
        content: insertform.courseIntroduction.content,
        object: insertform.courseIntroduction.object,
        pictureAddress: insertform.pictureAddress //上传图片
      }
      const uploadVideo = []
      const uploadPdf = []
      const chapters = []
      for(let i=0;i<chapterList.length;i++){
        uploadVideo.push(chapterList[i].video)
        uploadPdf.push(chapterList[i].pdf)
        chapters.push({name:chapterList[i].name})
      }
      const data = {
        course: course,
        chapters: chapters
      }
      await ajaxMsg(UPLOAD_COURSE, 'POST', data).then(async (res) => {
        correct = await uploadChapterVideo(res.chapterId, uploadVideo) && await uploadChapterPdf(res.chapterId, uploadPdf)
        if (insertform.ifPush)
          correct = await pushCourse(res.courseId, true) && correct
      })
    } catch {
      correct = false
    }
    resolve(correct)
  })
}

/**
 * 获取讲师列表
 * 2022年1月11日20:23:45
 */
async function getAllTeacher(){
  const data = await ajaxMsg(GET_ALL_TEACHERS,'GET')
  try {
    const teachers = []
    for(var i = 0;i<data.length;i++){
      teachers.push({label:data[i].id.toString()+' '+data[i].name ,key:i})
    }
    return teachers
  }catch (err){
    throw Error(err)
  }
}

/**
 * 获取课程类别列表
 * 2022年1月11日20:23:48
 */
async function getAllCourseType(){
  const data = await ajaxMsg(GET_ALL_COURSETYPES,'GET')
  try {
    const courseTypes = []
    for(var i = 0;i<data.length;i++){
      courseTypes.push({label:data[i].id.toString()+' '+data[i].type,key:i})
    }
    return courseTypes
  }catch (err){
    throw Error(err)
  }
}

/**
 * 初始化输入栏  tableData的值应该是具体到某个tableData[i]
 * 2022年1月11日20:23:50
 * @param tableData
 */
async function clearInput(tableData=null){
  if(tableData===null){
    return {
      coursedate:-1,
      courseName: '',
      teacher:'',
      courseType: '',
      pictureAddress:'',
      courseIntroduction: {target:'',content:'',object:''},
      addCourseChapter:openCourseChapter({}),
      chapterList:[],
      ifPush:false
    }
  }
  //this.getChapterList(this.tableData[i].coursedate)//2022年1月10日22:14:57 获取此id的章节列表
  try {
    return {
      coursedate:tableData.coursedate,
      courseName: tableData.courseName,
      teacher: tableData.teacher.id + ' ' + tableData.teacher.name,
      courseType: tableData.courseType.id + ' ' + tableData.courseType.type,
      courseIntroduction: {
        target:tableData.courseIntroduction.target,
        content:tableData.courseIntroduction.content,
        object:tableData.courseIntroduction.object
      },
      pictureAddress:tableData.pictureAddress,
      addCourseChapter: openCourseChapter(),
      chapterList:await getChapterList(tableData.coursedate),
      ifPush: await checkPushing(tableData.coursedate)
    }
  }catch (err){
    throw Error(err)
  }
}

/**
 * 清空章节输入框  chapter取chapterList[i]
 * 2022年1月11日23:16:51
 */
function openCourseChapter(chapter=null){
  if(chapter===null){
    return{
      name: '', videoAddress: '', pdfAddress: ''
    }
  }
  if(chapter.data!==undefined){
    chapter = chapter.data
  }
  try {
    return {
      name:chapter.name,videoAddress: chapter.videoAddress, pdfAddress: chapter.pdfAddress
    }
  }catch (err){
    throw Error(err)
  }
}

/**
 * 分割字符串，获取id
 * 2022年1月11日20:39:24
 * @param str 拼接字符串
 */
function spiltId(str){
  var arr=str.split(" ");
  if(arr.length>0){
    return Number(arr[0])
  }
  throw Error(`错误码： ${resData.errno} \n错误信息：${resData.message}`)
}

/**
 * 检测是否推送
 * 2022年1月11日20:49:59
 * @param cid 课程号
 */
async function checkPushing(cid){
  const param = new URLSearchParams()
  param.append('id',cid)
  return await ajaxMsg(GET_CHEACK_PUSH_COURSE,'GET',param)
}

/**
 * 获取章节列表
 * 2022年1月11日20:54:39
 * @param cid 课程号
 */
async function getChapterList(cid){
  const param = new URLSearchParams()
  param.append('id',cid);
  const res =  await ajaxMsg(GET_CHAPTERLIST,'GET',param)
  var list = []
  try {
    for (var i = 0; i < res.length; i++){
      list.push({data:res[i],status:-1})
    }
  }catch (err){
    throw Error(err)
  }
  return list
}

/**
 * 获取所有课程
 * 2022年1月11日21:02:15
 * @param page 页码
 * @param count 页尺寸
 */
async function getAllCourse(page,count){
  const param = new URLSearchParams()
  param.append('page',page)
  param.append('count',count)
  return normalizeData(await ajaxMsg(GET_ALL_COURSES,'GET',param)) //暂时先这样 返回成功提示暂无
  //this.updataTable(data)  data.courseList
}

/**
 * 搜索课程
 * 2022年1月11日21:18:33
 * @param searchInput 搜索信息
 * @param page 页码
 * @param count 页尺寸
 */
async function searchCourse(searchInput,page,count){
  if (searchInput===''){
    return await getAllCourse(page,count)
  }
  const param = new URLSearchParams()
  param.append('name',searchInput)
  param.append('page',page)
  param.append('count',count)
  return normalizeData(await ajaxMsg(GET_COURSES_SEARCH,'GET',param))//暂时先这样 返回成功提示暂无
}

/**
 * 规范化返回值
 * 2022年1月12日00:56:56
 * @param data 数据
 */
function normalizeData(data){
  try {
    if(data.count>0){
      var res = {courseList:[],pageCount:data.count}
      for(var i =0;i<data.courseList.length;i++){
        const course={
          coursedate: Number(data.courseList[i].id),
          courseName: data.courseList[i].name,
          teacher :data.courseList[i].teacher,
          courseType:data.courseList[i].courseType,
          courseIntroduction: {target:data.courseList[i].target,content: data.courseList[i].content,object: data.courseList[i].object},
          pictureAddress:data.courseList[i].pictureAddress,
        }
        res.courseList.push(course)
      }
      return res
    }
  }catch (err){
    throw Error(err)
  }
}

/**
 * 更新课程信息   讲师图片没做
 * 2022年1月11日21:23:30
 * @param insertfrom 课程信息
 * @param insertfromOld 旧课程信息
 * @param videoUpload 视频列表
 * @param pdfUpload pdf列表
 */
async function updataCourseMsg(insertfrom,insertfromOld,deleteChapter=[]){
  return new Promise(async function (resolve) {
    let correct
    try{
      var course = {
        id:insertfrom.coursedate,
        // name:insertfrom.courseName,
        // teacher:{id:spiltId(insertfrom.teacher)},
        // courseType:{id:spiltId(insertfrom.courseType)},
        // target:insertfrom.courseIntroduction.target,
        // content:insertfrom.courseIntroduction.content,
        // object:insertfrom.courseIntroduction.object,
      }
      //if(insertfrom.courseName!==insertfromOld.corseName)
      course.name = insertfrom.courseName
      //if(insertfrom.teacher!==insertfromOld.teacher)
      course.teacher = {id:spiltId(insertfrom.teacher)}
      //if(insertfrom.courseType!==insertfromOld.courseType)
      course.courseType = {id:spiltId(insertfrom.courseType)}
      //if(insertfrom.courseIntroduction.target!==insertfromOld.courseIntroduction.target)
      course.target = insertfrom.courseIntroduction.target
      //if(insertfrom.courseIntroduction.content!==insertfromOld.courseIntroduction.content)
      course.content = insertfrom.courseIntroduction.content
      //if(insertfrom.courseIntroduction.object!==insertfromOld.courseIntroduction.object)
      course.object = insertfrom.courseIntroduction.object
      if(insertfrom.pictureAddress!==insertfromOld.pictureAddress)
        course.pictureAddress = insertfrom.pictureAddress
      const nomal = nomalChapterList(insertfrom.chapterList, deleteChapter)
      const data = {
        course:course,
        chapterList:nomal.chapters
      }
      //console.log(data)
      await ajaxMsg(PUT_UPDATA_COURSE,'PUT',data).then(async (res) => {
          correct = await uploadChapterVideo(res, nomal.videoUpload) && await uploadChapterPdf(res,nomal.pdfUpload)
          if (insertfrom.ifPush !== insertfromOld.ifPush) {
            correct = await pushCourse(insertfrom.coursedate, insertfrom.ifPush) && correct
          }
      })
    }catch{
      correct = false
    }
    resolve(correct)
  })
}

/**
 * 规范化章节列表
 * 2022年1月13日23:51:11
 * @param chapterList
 * @param deleteChapter
 */
function nomalChapterList(chapterList,deleteChapter=[]){
  const res = {chapters:[],videoUpload:[],pdfUpload:[]}
  for(let i = 0; i<chapterList.length; i++){
    if(chapterList[i].status===1){
      res.chapters.push({chapter:{name:chapterList[i].data.name},status:chapterList[i].status})
      if(chapterList[i].data.video)
        res.videoUpload.push({id:-1,video:chapterList[i].data.video})
      else
        res.videoUpload.push({id:-2})
      if(chapterList[i].data.pdf)
        res.pdfUpload.push({id:-1,pdf:chapterList[i].data.pdf})
      else
        res.pdfUpload.push({id:-2})
    }
    else if(chapterList[i].status===-1)
      continue
    else {
      res.chapters.push({chapter:{id:chapterList[i].data.id,name:chapterList[i].data.name},status:chapterList[i].status})
      if(chapterList[i].data.video)
        res.videoUpload.push({id:chapterList[i].data.id,video:chapterList[i].data.video})
      if(chapterList[i].data.pdf)
        res.pdfUpload.push({id:chapterList[i].data.id,pdf:chapterList[i].data.pdf})
    }
  }
  for(let i = 0;i<deleteChapter.length;i++){
    res.chapters.push({chapter:{id:deleteChapter[i]},status:2})
  }
  return res
}

/**
 * 章节视频上传
 * 2022年1月17日15:24:533
 * @param chapterListId
 * @param videoUpload
 */
async function uploadChapterVideo(chapterListId,videoUpload=[]){
  if (chapterListId===true)
    chapterListId=[]
  try {
    let index = 0
    for(let i=0;i<videoUpload.length;i++){
      if(!videoUpload[i].video)
        continue
      const data = new FormData
      data.append('type',0)
      data.append('file',videoUpload[i].video.raw)
      if(videoUpload[i].id>=0){
        data.append('chapterId',videoUpload[i].id)
        await ajaxFile(UPLOAD_CHPATER_VIDEO,'POST',data,{},'blob','multipart/form-data')
      }
      else if(videoUpload[i].id>-2){
        data.append('chapterId',chapterListId[index++])
        await ajaxFile(UPLOAD_CHPATER_VIDEO,'POST',data,{},'blob','multipart/form-data')
      }
      else{
        index++
      }
    }
    return true
  }catch{
    return false
  }
}

/**
 * 章节文件资料上传
 * 2022年1月17日15:38:39
 * @param chapterListId
 * @param pdfUpload
 */
async function uploadChapterPdf(chapterListId,pdfUpload=[]){
  // const configUpload = {
  //   onUploadProgress: (progress) => {
  //     // 格式化成百分数
  //     process = Math.floor(progress.loaded/progress.total*100) + '%'
  //   }
  // }
  try {
    if (chapterListId===true)
      chapterListId=[]
    let index = 0
    for(let i=0;i<pdfUpload.length;i++){
      if(!pdfUpload[i].pdf)
        continue
      const data = new FormData
      data.append('type',1)
      data.append('file',pdfUpload[i].pdf.raw)
      if(pdfUpload[i].id>=0){
        data.append('chapterId',pdfUpload[i].id)
        ajaxFile(UPLOAD_CHPATER_VIDEO,'POST',data,{},'blob','multipart/form-data')
      }
      else if(pdfUpload[i].id>-2){
        data.append('chapterId',chapterListId[index++])
        ajaxFile(UPLOAD_CHPATER_VIDEO,'POST',data,{},'blob','multipart/form-data')
      }
      else{
        index++
      }
    }
    return true
  }catch {
    return false
  }
}

/**
 * 更新推送状态
 * 2022年1月11日22:35:52
 * @param cid 课程名
 * @param ifPush 是否推送
 */
async function pushCourse(cid,ifPush){
  const param = new URLSearchParams();
  param.append('id',cid)
  try {
    if(ifPush){
      return await ajaxMsg(SET_ADD_PUSH,'post',param)
    }
    else {
      return await ajaxMsg(SET_REMOVE_PUSH,'delete',param)
    }
  }catch{
    return false
  }
}

/**
 * 删除课程  返回失败还没改
 * 2022年1月11日23:23:43
 * @param cid 课程id
 * @param checkInsearch 搜索状态
 */
async function deleteCourse(cid,checkInsearch){
  const param = new URLSearchParams()
  param.append('id',cid)
  return await ajaxMsg(DELETE_COURSE,'DELETE',param)
}

/**
 * 批量增加章节
 * 2022年1月12日09:23:39
 * @param chapterList 增加的章节列表
 */
async function addChapterList(chapterList){
  const param = new URLSearchParams()
  param.append('list',chapterList)
  return await ajaxMsg(POST_ADD_CHAPTER,'POST',param)
}

/**
 * 删除章节
 * 2022年1月12日09:33:01
 * @param chapterId 章节id编号
 */
async function deleteChapter(chapterId){
  const param = new URLSearchParams()
  param.append('id',chapterId)
  return await ajaxMsg(DELETE_CHAPTER,'DELETE',param)
}

/**
 * 修改章节
 * 2022年1月12日09:36:15
 * @param chapter 章节对象
 */
async function updataChapter(chapter){
  const param = new URLSearchParams()
  param.append('chapter',chapter)
  return await ajaxMsg(PUT_UPDATA_CHAPTER,'PUT',param)
}

export {
  uploadCourse,
  getAllTeacher,
  getAllCourseType,
  clearInput,
  openCourseChapter,
  getAllCourse,
  searchCourse,
  updataCourseMsg,
  deleteCourse,
}
