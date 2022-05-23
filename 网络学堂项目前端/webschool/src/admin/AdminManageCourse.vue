<template>
  <div>
    <span class="wenzi">管理课程</span>
    <div class="button"><el-button  type="danger" @click="handleClick4" plain>返回首页</el-button></div>
    <div class="topcolor"></div>
    <div class="top">
      <el-main>
        <div>
          <span><el-input v-model="seacrhInput" style="width: 400px;left:605px;position: relative" placeholder="请输入内容" @keyup.native.enter="searchCourseButton" clearable></el-input></span>
          <span><el-button @click="searchCourseButton" style="width: 100px;left:625px;position: relative"  type="danger"  round>搜索</el-button></span>
        </div>
        <div style="height: 15px"></div>
        <el-table
          :data="tableData"
          v-loading="courseTableLoading"
          stripe
          style="width: 100%;text-align: center">
          <el-table-column
            prop="coursedate"
            label="课程编号"
            width="200"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="courseName"
            label="课程名称"
            width="525"
            align="center">
          </el-table-column>
          <el-table-column
            prop="teacher.name"
            label="教师名称"
            width="200"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
            align="center">
            <template slot-scope="scope">
              <el-button @click="deleteCourseButton(scope.$index)" type="danger"  round size="small">移除</el-button>
              <el-button type="danger"  @click="open(scope.$index)" round size="small" >修改</el-button>
            </template>

          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageCount"
          style="float:right;top: 20px;position: relative">
        </el-pagination>
      </el-main>
    </div>

    <el-dialog :visible.sync="courseEditorVisible" width='900px' >
      <el-form
        v-loading="chapterListLoading"
        :rules="rules"
        :model="insertform"
        ref="dataForm"
        label-position="left"
        label-width="90px"
        style="width: 700px; margin-left:50px;">
        <el-row :span="24">
          <el-form-item label="课程封面" style="width:700px;text-align: left"  prop="photoAddress">
            <input type="file" id="selectPic" hidden="" @change="picPreview">
            <p @click="selectPicture" >
              <img :src="defaultImage"  v-if="ifHaveImage" style="height: 10vmax;border-radius: 12px" alt=""/>
              <img :src="showPhoto" alt="" style="height: 10vmax" />
            </p>
          </el-form-item>
          <el-form-item label="课程名称"  prop="courseName" style="width: 700px">
            <el-input placeholder="请输入课程名称" :disabled="checked" v-model="insertform.courseName"></el-input>
          </el-form-item>
        </el-row>

        <el-row :span="24">
          <el-form-item  label="选择讲师" prop="teacher" >
            <el-select
              v-model="insertform.teacher"
              class="filter-item"
              placeholder="请选择讲师"
              style="left: 0;position: absolute"
              :disabled="checked">
              <el-option
                v-for="item in teachers"
                :key="item.key"
                :label="item.label"
                :value="item.label"/>
            </el-select>
          </el-form-item>
        </el-row>

        <el-row :span="24">
          <el-col :span="12">
            <el-form-item label="课程分类" prop="courseType" >
              <el-select
                v-model="insertform.courseType"
                class="filter-item"
                placeholder="请选择课程分类"
                style="left: 0;position: absolute"
                :disabled="checked">
                <el-option
                  v-for="item in courseTypes"
                  :key="item.key"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="课程目标"  prop="courseIntroduction.target" style="width: 700px">
          <el-input placeholder="请输入课程目标" :disabled="checked" v-model="insertform.courseIntroduction.target"></el-input>
        </el-form-item>
        <el-form-item label="主要内容" style="width:700px" prop="courseIntroduction.content">
          <el-input placeholder="请输入主要内容"  :disabled="checked" type="textarea"  :rows="4" v-model="insertform.courseIntroduction.content"></el-input>
        </el-form-item>
        <el-form-item label="针对对象"  prop="courseIntroduction.object" style="width: 700px">
          <el-input placeholder="请输入针对对象" :disabled="checked" v-model="insertform.courseIntroduction.object"></el-input>
        </el-form-item>
        <el-form-item label="课程章节" prop="addCourseChapter" style="width:700px">
          <!--          <el-input placeholder="添加课程章节" type="textarea" :disabled="checked" :rows="4" v-model="insertform.addCourseChapter">-->
          <!--          </el-input>-->
          <!--          章节显示的表格-->
          <el-table
            :data="chapterListData"
            height="250"
            border
            style="width: 900px">
            <el-table-column
              prop="name"
              label="章节名称"
              width="408">
            </el-table-column>
            <el-table-column
              label="操作"
              width="200"
              align="center">
              <template slot-scope="scope">
                <!--               新增删除章节和修改章节按钮-->
                <el-button @click="deleteChpaterButton(scope.$index)" type="danger"  round size="small">移除</el-button>
                <el-button type="danger"  @click="openCourseChapter(scope.$index)" round size="small" >修改</el-button>
              </template>

            </el-table-column>
          </el-table>
        </el-form-item>
        <el-row style="text-align: right;">
          <el-button type="danger" icon="el-icon-plus" @click="insert()" round>添加章节</el-button>
        </el-row>
        <el-dialog :visible.sync="chapterInsertVisible" width='900px' append-to-body>
          <el-form
            :rules="rules"
            :model="insertform.addCourseChapter"
            ref="chapterDataForm"
            label-position="left"
            label-width="90px"
            style="width: 700px; margin-left:50px;">
            <el-row :span="24">
              <el-form-item label="章节名称"  prop="name" style="width: 700px">
                <el-input placeholder="请输入章节名称"  v-model="insertform.addCourseChapter.name"></el-input>
              </el-form-item>
            </el-row>
            <el-row :span="24">
              <el-form-item label="视频章节"  prop="videoAddress" style="width: 700px">
                <div class="button">
                  <el-upload :file-list="newUploadVideo" action="alert" accept=".mp4" :auto-upload="false" :on-change="loadJsonFromVideo" :on-remov="loadJsonFromVideo">
                    <el-button size="small" type="danger" >选择视频</el-button>
                  </el-upload>
                </div>
              </el-form-item>
            </el-row>
            <el-row :span="24">
              <el-form-item label="pdf"  prop="pdfAddress" style="width: 700px">
                <div class="button">
                  <el-upload :file-list="newUploadPdf" action="alert" :auto-upload="false" :on-change="loadJsonFromPdf" :on-remov="loadJsonFromPdf">
                    <el-button size="small" type="danger" >选择pdf</el-button>
                  </el-upload>
                </div>
              </el-form-item>
            </el-row>
            <div class="button">
              <el-button @click="chapterInsertVisible=false" type="danger" >取消</el-button>
              <el-button type="danger" @click="confirm" >确定</el-button>
            </div>
          </el-form>
        </el-dialog>
        <el-row :span="24">
          <el-checkbox type="danger" style="left:0;bottom: 0;position: absolute;" v-model="insertform.ifPush" >是否推送课程</el-checkbox>
          <!-- `checked` 为 true 或 false -->
          <div class="button">
            <el-button round  type="danger" @click="showdisable">编辑</el-button>
            <el-button type="danger" @click="confirm_upload" round>确认修改</el-button>
          </div>
        </el-row>
      </el-form>
    </el-dialog>


    <!--    新增修改章节弹窗-->
    <el-dialog :visible.sync="chapterEditorVisible" width='900px' append-to-body>
      <el-form
        :model="insertform"
        label-position="left"
        label-width="90px"
        style="width: 700px; margin-left:50px;">
        <el-row :span="24">
          <el-form-item label="章节名称"  prop="addCourseChapter.name" style="width: 700px">
            <el-input placeholder="请输入章节名称"  v-model="insertform.addCourseChapter.name"></el-input>
          </el-form-item>
        </el-row>
        <el-row :span="24">
          <el-form-item label="视频章节"  prop="addCourseChapter.videoAddress" style="width: 700px">
            <div class="button">
              <el-upload :file-list="newUploadVideo" action="alert" accept=".mp4" :auto-upload="false" :on-change="loadJsonFromVideo" :on-remov="loadJsonFromVideo">
                <el-button size="small" type="danger" >选择视频</el-button>
              </el-upload>
            </div>
          </el-form-item>
        </el-row>
        <el-row :span="24">
          <el-form-item label="pdf"  prop="addCourseChapter.pdfAddress" style="width: 700px">
            <div class="button">
              <el-upload :file-list="newUploadPdf" action="alert"  :auto-upload="false" :on-change="loadJsonFromPdf" :on-remov="loadJsonFromPdf">
                <el-button size="small" type="danger" >选择pdf</el-button>
              </el-upload>
            </div>
          </el-form-item>
        </el-row>
        <div class="button">
          <el-button @click="chapterEditorVisible=false;" type="danger" >取消</el-button>
          <!--          这个确认将直接修改章节信息，外围确认修改负责上方的输入框-->
          <el-button type="danger" @click="updateCourseChapter" >确认</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!--    删除章节确认过程-->
    <el-dialog :visible.sync="deleteChapterConfirmBox" width="40%">
<!--      <template slot-scope="scope">-->
        <h1>您确定要删除嘛？</h1>
        <div class="button">
          <el-button @click="deleteChapterConfirmBox=false"  type="danger" >取消</el-button>
          <el-button type="danger" @click="deleteChapter" >确认</el-button>
        </div>
<!--      </template>-->
    </el-dialog>

    <el-dialog :visible.sync="deleteCourseConfirmBox" width="40%">
      <template slot-scope="">
        <h1>您确定要删除嘛？(删除课程可能有严重后果)</h1>
        <div class="button">
          <el-button @click="deleteCourseConfirmBox=false" type="danger" >取消</el-button>
          <el-button type="danger" @click="deleteCourse" >确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllTeacher,
  getAllCourseType,
  clearInput,
  openCourseChapter,
  getAllCourse,
  searchCourse,
  updataCourseMsg,
  deleteCourse} from "@/services/AdminManageCourse";
import {cloneObj, getImageBypath} from "@/services/Common";

export default {
  data() {
    return {
      defaultImage: require("../assets/defaultAddUerImage.png"),
      ifHaveImage:true,
      showPhoto:'',

      //文件上传相关
      //uploadFilename: null,
      // uploadVideo: [{chapterId:0,video:{}}],
      // uploadPdf: [{chapterId:0,pdf:{}}],
      newUploadVideo:[],
      newUploadPdf:[],

      chapterListLoading: false,
      courseTableLoading:false,
      //2022年1月7日18:44:09
      seacrhInput:'',
      checkInsearch:false,

      courseIndex:-1,
      chapterIndex:-1,
      checked:true,
      courseEditorVisible :false,
      chapterInsertVisible:false,
      chapterEditorVisible:false,
      deleteChapterConfirmBox:false,
      deleteCourseConfirmBox:false,
      dialogVisible: false,
      currentPage: 1, //初始页
      pagesize: 5,    // 每页的数据
      pageCount:0,    //总数据数量
      chapterUpdataIndex:0,//抱歉，保存修改编号用的

      deleteChapterList:[],
      chapterListData:[],
      tableData: [{
        coursedate: 1,
        courseName: '语文',
        pictureAddress:'',
        teacher :{id:0,name:'李献辉'},
        courseType:{id:1,type:'计算机'},
        courseIntroduction:{},
      }],
      teachers: [
        { label: '1 程明', key: 1}    //这里改成了label是id'和名字的拼接空格分割 2022年1月8日15:07:35
      ],
      courseTypes: [
        { label: '1 计算机', key: 1 }
      ],
      insertformOld:{},
      //修改前端页面 1月10  16.02
      insertform: {
        coursedate:0,
        courseName: '',
        teacher: '',
        courseType: '',
        pictureAddress:'',
        courseIntroduction: {target:'',content:'',object:''},
        addCourseChapter:{name:'',videoAddress:'',pdfAddress:''},  //updataCourseMsg函数用到了 courseId:0,
        chapterList:[],
        ifPush:false,//是否推送
      },
      rules: {
        courseName: [
          { required: true, message: '请输入课程名称', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        teacher: [
          { required: true, message: '请选择讲师', trigger: 'change' }
        ],// { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        courseType: [
          { required: true, message: '请选择课程分类', trigger: 'change' }
        ],
        name:[
          { required: true, message: '请输入章节名称', trigger: 'blur'},
        ],
        // courseIntroduction: [
        //   { required: true, message: '请输入课程简介', trigger: 'blur' },
        //   // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        // ],
        // addCourseChapter:[
        //   {required: true, message: '请添加课程章节', trigger: 'blur'},
        // ],
        // chaptername:[
        //   {required: true, message: '请输入章节名称', trigger: 'blur'}]
      }

    }
  },
  methods: {

    // getTrueIndex(index){
    //   let truth = index
    //   for(let i = 0;i<this.insertform.chapterList.length;i++){
    //     if(this.insertform.chapterList[i].status===2){
    //       truth++
    //     }
    //   }
    //   return truth
    // },

    //图片问题
    selectPicture:function(){
      document.getElementById('selectPic').click()
    },

    //将头像显示
    picPreview: function (e) {
      let $target = e.target || e.srcElement;
      let file = $target.files[0];
      if (!e || !window.FileReader) return ; // 判断是否支持FileReader
      //3M以内
      if(file.size>1024*1024*3){
        this.commonF.popMsg("文件大小不能超过3M！",'warning')
      }
      else{
        const reader = new FileReader();
        reader.onload = (data) => {
          let res = data.target || data.srcElement;
          this.showPhoto = res.result;
          this.ifHaveImage=false;
          this.insertform.pictureAddress = '-1'//表示已经更改
        };
        reader.readAsDataURL(file)
      }
      e = null
    },

    loadJsonFromVideo (file, fileList) {
      //this.uploadFilename = file.name
      if (fileList.length > 0) {
        this.newUploadVideo = [fileList[fileList.length - 1]]  // 这一步，是 展示最后一次选择的csv文件
        if(this.newUploadVideo.length>0)
          if(this.newUploadVideo[0].size>500*1024*1024){
            this.newUploadVideo = []
            this.commonF.popMsg("视频大小不能超过500M！",'warning')
          }
      }
      else if(fileList.length===0){
        this.newUploadVideo.splice(0,this.newUploadVideo.length)
      }
      fileList=[]
    },

    loadJsonFromPdf (file, fileList) {
      //this.uploadFilename = file.name
      if (fileList.length > 0) {
        this.newUploadPdf = [fileList[fileList.length - 1]]  // 这一步，是 展示最后一次选择的csv文件
        if(this.newUploadPdf.length>0)
          if(this.newUploadPdf[0].size>10*1024*1024){
            this.newUploadPdf = []
            this.commonF.popMsg("文件大小不能超过10M！",'warning')
          }
      }
      else if(fileList.length===0){
        this.newUploadPdf.splice(0,this.newUploadPdf.length)
      }
      fileList=[]
    },

    handleClick4() {
      this.$router.push({
        name:'recommend'
      })
    },

    showdisable(){
      this.checked=false
      this.chapterListLoading=false
    },

    async deleteCourse() {
      this.deleteCourseConfirmBox=false
      if(await deleteCourse(this.tableData[this.courseIndex].coursedate))
        this.commonF.popMsg("删除成功",'success')
      else
        this.commonF.popMsg('删除失败','error')
      this.flushTable()
      //rows.splice(index, 1);
    },

    deleteChpaterButton(index){
      this.chapterIndex = index
      this.deleteChapterConfirmBox = true
    },

    deleteCourseButton(index){
      this.courseIndex = index
      this.deleteCourseConfirmBox = true
    },

    //新增删除课程章节 2022年1月12日12:17:29
    deleteChapter(){
      //rows.splice(index, 1);
      const index = this.chapterIndex
      this.deleteChapterConfirmBox=false
      if(!this.insertform.chapterList[index].status)
        this.deleteChapterList.push(this.insertform.chapterList[index].data.id)
      else if(this.insertform.chapterList[index].status!==1)
        this.deleteChapterList.push(this.insertform.chapterList[index].data.id)
      this.insertform.chapterList.splice(index,1)
      this.updataChaptertable()
    },

    //新增修改课程章节界面,打开课程章节 1月10 16.30
    openCourseChapter(index){
      this.chapterEditorVisible=true
      this.chapterUpdataIndex = index
      this.insertform.addCourseChapter.name = this.insertform.chapterList[index].data.name
      this.updateNewVideo(this.insertform.chapterList[index].data.video?index:-1)
      this.updateNewPDF(this.insertform.chapterList[index].data.pdf?index:-1)
      //this.insertform.addCourseChapter = openCourseChapter()
    },

    //保存修改的课程章节
    updateCourseChapter() {
      this.commonF.popMsg("修改成功,记得提交哦", 'success')
      this.chapterEditorVisible = false;
      //新增判断 2022年1月17日15:20:14
      const data = {
        name: this.insertform.addCourseChapter.name,
        id: this.insertform.chapterList[this.chapterUpdataIndex].data.id
      }
      // console.log(data)
      if (this.insertform.chapterList[this.chapterUpdataIndex].status !== 1){
        this.insertform.chapterList[this.chapterUpdataIndex] ={
          data:data,status:0
        }
      }
      else{
        this.insertform.chapterList[this.chapterUpdataIndex] ={
          data:data,status:1
        }
      }
     //console.log(this.insertform.chapterList)

      //文件列表推入
      if(this.newUploadVideo.length>0)
        this.insertform.chapterList[this.chapterUpdataIndex].data.video=this.newUploadVideo[0]
      if(this.newUploadPdf.length>0)
        this.insertform.chapterList[this.chapterUpdataIndex].data.pdf=this.newUploadPdf[0]
      //console.log(this.insertform.chapterList[this.chapterUpdataIndex].data)
      this.updataChaptertable()
    },

    // 初始页currentPage、初始每页数据数pagesize和数据data-->
    handleSizeChange: function (size) {
      this.pagesize = size;
      this.currentPage = 1;
      this.flushTable()
      //console.log(this.pagesize)  //每页下拉显示数据-->
    },
    handleCurrentChange: function(currentPage){
      // console.log(currentPage)
      this.currentPage = currentPage;
      this.flushTable()
      //console.log(this.currentPage)  //点击第几页
    },

    //打开修改时显示初始化
    open(index) {
      this.$refs["dataForm"] && this.$refs["dataForm"].resetFields();
      this.chapterListLoading=true
      this.courseEditorVisible = true
      this.checked = true
      //this.$refs["dataForm"].resetFields();   2022年1月10日22:27:15
      //console.log(this.tableData[index])
      //this.insertform = await clearInput(this.tableData[index])
      this.flushinsertform(this.tableData[index])
    },

    /**
     * 刷新输入框
     * @param data
     */
    flushinsertform(data){
      clearInput(data).then((res)=>{
        this.insertform = res
        this.inserformOld = cloneObj({pictureAddress:this.insertform.pictureAddress,ifPush: this.insertform.ifPush})
        if(this.insertform.pictureAddress!==''){
          getImageBypath(this.insertform.pictureAddress).then((res)=>{
            this.showPhoto = res
            this.ifHaveImage = false
          })
        }
        else{
          this.ifHaveImage = true
          this.showPhoto = ''
        }
        this.updataChaptertable()
      })
////////
      this.chapterListLoading = false
      this.$forceUpdate()
    },

    updateNewPDF(index = -1){
      try {
        this.newUploadPdf = []
        if(index>=0){
          this.newUploadPdf.push(this.insertform.chapterList[index].data.pdf)
        }
      }catch (err){
        throw Error(err)
      }
    },

    updateNewVideo(index = -1){
      try {
        this.newUploadVideo = []
        if(index>=0)
          this.newUploadVideo.push(this.insertform.chapterList[index].data.video)
      }catch (err){
        throw Error(err)
      }
    },

    /**
     * 更新章节表
     * 2022年1月12日12:15:06
     */
    updataChaptertable(){
      //console.log(this.insertform.chapterList,this.chapterIndex)
      this.insertform.addCourseChapter = openCourseChapter()
      //this.chapterListLoading = true
      // this.Data.splice(0,this.Data.length)
      // try {
      //   for(let i=0; i<this.insertform.chapterList.length; i++){
      //     if(this.insertform.chapterList[i].status!==2)
      //       this.Data.push(cloneObj(this.insertform.chapterList[i].data))
      //     this.chapterListLoading = false
      //   }
      // }catch (err){
      //   throw Error(err)
      // }
      this.chapterListData.splice(0,this.chapterListData.length)
      for(let i = 0;i<this.insertform.chapterList.length;i++){
        this.chapterListData.push(this.insertform.chapterList[i].data)

      }
      this.$forceUpdate()
    },

    insert() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.chapterInsertVisible = true
          this.insertform.addCourseChapter = openCourseChapter()
          this.updateNewVideo()
          this.updateNewPDF()
          //this.$refs["chapterDataForm"].resetFields();
          //this.chapterUpdataIndex=-1  暂时不用
        } else {
          this.commonF.popMsg("error submit!!!",'error')
          return false;
        }
      });
    } ,

    confirm (){
      this.$refs["chapterDataForm"].validate((valid) => {
        if (valid) {
          if(this.newUploadVideo.length>0) {
            this.commonF.popMsg("增加成功,记得提交哦", 'success')
            //2022年1月19日10:25:18
            const data = {
              name: this.insertform.addCourseChapter.name,
              id: -1
            }
            //文件列表推入 id为-1
            if (this.newUploadVideo.length > 0)
              data.video = this.newUploadVideo[0]
            if (this.newUploadPdf.length > 0)
              data.pdf = this.newUploadPdf[0]
            this.insertform.chapterList.push({data: data, status: 1})

            this.updataChaptertable()
            this.chapterInsertVisible = false
          }else
            this.commonF.popMsg("请选择视频!",'error')
          return false;
          } else {
          this.commonF.popMsg('error submit!!','error')
          return false;
        }
      });
    },

    //提交
    confirm_upload() {
      this.$refs["dataForm"].validate(async (valid) => {
        if (valid) {
          //console.log(this.insertform)
          if(!this.ifHaveImage&&this.insertform.pictureAddress!==this.insertformOld.pictureAddress){
            this.insertform.pictureAddress = this.showPhoto
          }
          this.chapterListLoading = true
          const res = await updataCourseMsg(this.insertform,this.inserformOld,this.deleteChapterList)
          if(res){
            this.commonF.popMsg("修改成功",'success')
          }
          else {
              this.commonF.popMsg("修改失败",'error')
          }
          this.chapterListLoading = false
          this.courseEditorVisible = false
        } else {
          //console.log('error submit!!');
          this.commonF.popMsg("error submit!!",'error')
          return false;
        }
      });
    },

    searchCourseButton(){
      this.checkInsearch = this.seacrhInput!==''
      this.flushTable()
    },

    //动态重传没做
    async flushTable() {
      this.courseTableLoading  = true
      let res = null;
      if (this.checkInsearch) {
        this.currentPage = 1
        res = await searchCourse(this.seacrhInput,this.currentPage,this.pagesize)
      } else {
        res = await getAllCourse(this.currentPage,this.pagesize)
      }
      this.tableData = res.courseList
      this.pageCount = res.pageCount
      this.courseTableLoading = false
      this.$forceUpdate()
    },
  },

  created() {
    getAllTeacher().then((res)=>{
      this.teachers = res
    })
    getAllCourseType().then((res)=>{
      this.courseTypes = res
    })
    this.flushTable()
  }

}
</script>

<style scoped>
.topcolor{
  top: 40px;
  height: 2px;
  left:2%;
  width: 98%;
  background: #d3dce6;
  position: relative;
}
.wenzi{
  position: relative;
  font-size: 30px;
  left: 50px;
  top: 20px;
  float: left;
}
.button{
  top: 20px;
  text-align: right;
  position: relative;
}
.top {
  top: 30px;
  position: relative;
}

</style>

