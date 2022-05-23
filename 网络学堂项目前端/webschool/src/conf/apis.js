/**
 * @description 服务端接口列表
 *
 */
const GET_ADMIN_INTERCEPT_VERIFICATION = 'admin/interceptVerification'; //管理员token校验
const POST_ADMIN_LGOIN = 'admin/login'; //管理员登录
const GET_USER_INTERCEPT_VERIFICATION = 'student/interceptVerification'; //用户token校验
const POST_USER_LGOIN = 'student/login'; //用户登录
const GET_ALL_COURSES ='admin/query/allCourses';  //查询课程的部分信息
const GET_COURSES_SEARCH='common/query/course/byCourseName';  //根据课程名查询课程
const PUT_UPDATA_COURSE = '/admin/change/course';  //修改课程信息
const POST_ADD_CHAPTER='admin/add/chapters';   //增加章节
const PUT_UPDATA_CHAPTER='admin/change/chapter';  //修改章节信息
const DELETE_CHAPTER = 'admin/remove/chapter/byId';  //根据章节id删除章节
const GET_CHEACK_PUSH_COURSE='admin/query/course/isPushCourse'; //根据课程id查询是否推送
const GET_ALL_TEACHERS='admin/query/allTeachers2';  //查询所有讲师 不分页
const GET_ALL_COURSETYPES='common/query/allCourseType';  //
const GET_CHAPTERLIST='common/query/chapter/byCourseId';   //
const DELETE_COURSE='/admin/remove/course/byCourseId';  // 根据课程id删除课程
const UPLOAD_COURSE='admin/add/course' ;   //上传课程
const SET_ADD_PUSH='admin/add/pushCourse/byCourseId';  //根据课程id增加推送课程
const SET_REMOVE_PUSH='admin/remove/pushCourse/byCourseId';  //根据课程id删除推送课程
const PUT_ADD_TEACHER='admin/add/teacher';  //增加讲师
const DELETE_TEACHER='admin/remove/teacher/byTeacherId';  //根据讲师id删除讲师
const PUT_UPDATA_TEACHER='admin/change/teacher';  // 修改讲师信息
const GET_SEACHER_TEACHERS_PAGE='admin/query/teachers/byTeacherName';  //根据讲师名称查询讲师
const GET_ALL_TEACHER_PAGE='admin/query/allTeachers';   //查询所有讲师
const GET_ALL_STUDENT_TIEM='admin/query/allStudentAllTime';        //查询所有学生的学习总时长
const GET_STUDENT_TIME_BYNAME='admin/query/studentAllTime/byStudentName';  //根据学生姓名查询学生的学习总时长
const GET_COURSE_INFORMATION='common/query/course/byCourseId';         //通过课程id查找该课程信息
const UPDATE_COLLECTION_COURSE='student/addOrRemove/collectionCourse'   //更新收藏状态
const UPDATE_STUDENT_CHAPTER_TIME = 'student/change/studentChapterTime'    //增加学生某章节的时长
const ADD_STUDENT_COURSE_TIME = 'student/add/studentCourseTime'    //增加学生某课程的时长
const GET_STUDENT_CHAPTER_TIME = 'student/query/studentChapterTime/byStudentIdAndChapterId'  //查询学生观看章节时长
const GET_STUDENT_INFORMATION ='student/query/student/byId'   //根据学生id查找学生信息
const GET_STUDENT_COLLECTIONLIST = 'student/query/collectionCourse/byStudentId2'     //根据学生id查找学生收藏的课程 不分页
const GET_STUDENT_COLLECTIONLIST_PAGE='student/query/collectionCourse/byStudentId' //根据学生id查找学生收藏的课程
const GET_STUDENT_HISTORY = 'student/query/studentCourseTime/byStudentId2'  //根据学生id查询学生学习课程的信息(时长、浏览记录) 不分页
const GET_STUDENT_HISTORY_PAGE='student/query/studentCourseTime/byStudentId' //根据学生id查询学生学习课程的信息(时长、浏览记录)
const UPDATE_STUDENT_INFORMATION='student/change/student'   //修改学生信息
const GET_COURSE_BY_TYPE = 'common/query/course/byCourseTypeId' //根据课程类别获取该类别下的所有课程
const GET_Push_Courses = 'common/query/pushCourses'//查询推荐课程
const CHECK_STUDENT_COLLECTION='student/query/collectionCourse/isExists'  //根据学生id和课程id判断是否已经收藏了该课程
const GET_COURSES_SEARCH2='common/query/course/byCourseName2';  //根据课程名查询课程-不分页
const GET_COURSE_BY_TEACHER_NAME2 = 'common/query/course/byTeacherName2'//根据讲师名字查询课程-不分页
const UPDATE_STUDENT_PASSWORD='student/change/password'  //修改学生密码
const SEARCH_HISTORY_PAGE='student/query/studentCourseTime/byDateAndCourseName'//根据学生id、日期范围和课程名查询学生学习课程的信息(时长、浏览记录)
const CHECK_CHAPTER_PLAY_DONE='student/query/chapter/isDone'
const SEARCH_COURSE_UPLOAD_TIME='common/query/CourseUploadTime/byCourseId'//根据课程列表里每个课程id获取课程上传时间
const SEARCH_COURSE_COLLECTION_COUNT='common/query/CourseCollectionCount/byCourseId'//根据课程列表里每个课程id获取被收藏数
const SEARCH_COURSE_VIDEO_LENGTH='common/query/CourseVideoLength/byCourseId'//根据课程列表里每个课程id获取课程视频总时长


const UPLOAD_CHPATER_VIDEO='admin/add/videoOrPdf' //接收视频

const GET_FILE='common/sendImg'
const DOWNLOADPDF='common/sendPdf'

const GET_PDF='common/sendPdf'

export {
  GET_ADMIN_INTERCEPT_VERIFICATION,
  GET_USER_INTERCEPT_VERIFICATION,
  POST_ADMIN_LGOIN,
  POST_USER_LGOIN,
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
  PUT_ADD_TEACHER,
  PUT_UPDATA_TEACHER,
  DELETE_TEACHER,
  GET_SEACHER_TEACHERS_PAGE,
  GET_ALL_TEACHER_PAGE,
  SET_ADD_PUSH,
  SET_REMOVE_PUSH,
  GET_ALL_STUDENT_TIEM,
  GET_STUDENT_TIME_BYNAME,
  GET_COURSE_INFORMATION,
  UPDATE_COLLECTION_COURSE,
  UPDATE_STUDENT_CHAPTER_TIME,
  ADD_STUDENT_COURSE_TIME,
  GET_STUDENT_CHAPTER_TIME,
  GET_STUDENT_INFORMATION,
  GET_STUDENT_COLLECTIONLIST,
  GET_STUDENT_COLLECTIONLIST_PAGE,
  GET_STUDENT_HISTORY,
  GET_STUDENT_HISTORY_PAGE,
  UPDATE_STUDENT_INFORMATION,
  GET_COURSE_BY_TYPE,
  GET_Push_Courses,
  SEARCH_HISTORY_PAGE,
  CHECK_STUDENT_COLLECTION,
  UPDATE_STUDENT_PASSWORD,
  GET_COURSES_SEARCH2,
  GET_COURSE_BY_TEACHER_NAME2,
  GET_FILE,
  GET_PDF,
  UPLOAD_CHPATER_VIDEO,
  CHECK_CHAPTER_PLAY_DONE,
  SEARCH_COURSE_UPLOAD_TIME,
  SEARCH_COURSE_COLLECTION_COUNT,
  SEARCH_COURSE_VIDEO_LENGTH,
  DOWNLOADPDF
}
