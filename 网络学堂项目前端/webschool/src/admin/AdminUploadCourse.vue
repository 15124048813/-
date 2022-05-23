<template>
  <div>
    <span class="wenzi">上传课程</span>
    <div class="button"><el-button  type="danger" name="first" @click="handleClick4" plain>返回首页</el-button></div>
    <div class="topcolor"></div>
    <div class="top">
      <el-container>
        <el-main>
          <el-form
            :rules="rules"
            :model="insertform"
            ref="courseDateForm"
            label-position="left"
            label-width="90px"
            style="width: 700px; margin-left:50px;">
            <el-form-item label="课程封面" style="width:800px;text-align: left"  prop="photoAddress">
              <input type="file" id="selectphoto" hidden="" @change="photoPreview">
              <p @click="selectPhoto()" style="width: 25%;cursor: pointer">
                <img :src="deafaultImage"  v-if="ifHaveImage" style="height: 7vmax;border-radius: 10px" alt=""/>
                <img :src="showPhoto" alt="" style="height: 7vmax" />
              </p>
            </el-form-item>
            <el-row :span="24">
              <el-form-item label="课程名称"  prop="courseName" style="width: 700px">
                <el-input placeholder="请输入课程名称(20字以内)" maxlength="20" v-model="insertform.courseName"></el-input>
              </el-form-item>
            </el-row>

            <el-row :span="24">
              <el-col :span="12">
                <el-form-item  label="选择讲师" prop="teacher" >
                  <el-select
                    v-model="insertform.teacher"
                    class="filter-item"
                    placeholder="请选择讲师">
                    <el-option
                      v-for="item in teachers"
                      :key="item.key"
                      :label="item.label"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

            </el-row>

            <el-row :span="24">

              <el-col :span="12">
                <el-form-item label="课程分类" prop="courseType" >
                  <el-select
                    v-model="insertform.courseType"
                    class="filter-item"
                    placeholder="请选择">
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
              <el-input placeholder="请输入课程目标(50字以内)"  maxlength="50" v-model="insertform.courseIntroduction.target"></el-input>
            </el-form-item>
            <el-form-item label="主要内容" style="width:700px" prop="courseIntroduction.content">
              <el-input placeholder="请输入主要内容(200字以内)"   type="textarea" maxlength="200" :rows="4" v-model="insertform.courseIntroduction.content"></el-input>
            </el-form-item>
            <el-form-item label="针对对象"  prop="courseIntroduction.object" style="width: 700px">
              <el-input placeholder="请输入针对对象(15字以内)" maxlength="15" v-model="insertform.courseIntroduction.object"></el-input>
            </el-form-item>
            <el-form-item label="课程章节" prop="addCourseChapter" style="width:700px">
              <!--              <el-input placeholder="添加课程章节" type="textarea"  :rows="4" v-model="insertform.addCourseChapter">-->
              <!--              </el-input>-->
              <el-table
                :data="chapterList"
                v-loading="loading2"
                height="250"
                border

                style="width: 100%">
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
                    <el-button @click.native.prevent="deleteChapterConfirmBox=true" type="danger"  round size="small">移除</el-button>
                    <el-button type="danger"  @click="openCourseChapter(scope.$index) " round size="small" >修改</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <div class="button">
              <el-container>
                <el-main>
                  <el-row style="">
                    <el-button type="danger"  icon="el-icon-plus" @click="insert()" round>添加章节</el-button>
                  </el-row>
                  <el-dialog :visible.sync="chapterInsertVisible" width='900px'>
                    <el-form
                      :rules="rules"
                      :model="insertform.addCourseChapter"
                      ref="chapterDateForm"
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
                          <el-upload :file-list="newUploadVideo" action="alert" accept=".mp4" :auto-upload="false" :on-change="loadJsonFromVideo" :on-remove="loadJsonFromVideo">
                            <el-button size="small" type="danger" >选择视频</el-button>
                          </el-upload>
                        </el-form-item>
                      </el-row>
                      <el-row :span="24">
                        <el-form-item label="pdf"  prop="pdfAddress" style="width: 700px">
                          <el-upload :file-list="newUploadPdf" action="alert" :auto-upload="false" :on-change="loadJsonFromPdf" :on-remove="loadJsonFromPdf">
                            <el-button size="small" type="danger" >选择pdf</el-button>
                          </el-upload>
                        </el-form-item>
                      </el-row>
                      <div class="button"><el-button @click="chapterInsertVisible=false;">取消</el-button>
                        <el-button type="danger" @click="confirm" >确定</el-button></div>
                    </el-form>
                  </el-dialog>
                </el-main>
              </el-container>
            </div>
          </el-form>

        </el-main>
      </el-container>
    </div>




    <div class="bottom">
      <el-container>
        <el-main>
          <el-checkbox style="right: 500px;bottom: 30px;position: absolute" v-model="insertform.ifPush">是否推送课程</el-checkbox>
          <!-- `checked` 为 true 或 false -->
          <el-button type="danger"  @click="confirm_upload" round>确认上传</el-button>

        </el-main>

      </el-container>
    </div>

    <!--    新增修改章节弹窗-->
    <el-dialog :visible.sync="chapterEditorVisble" width='900px' append-to-body>
      <el-form
        :rules="rules"
        :model="insertform.addCourseChapter"
        ref="updatechapterDateForm"
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
              <el-upload :file-list="newUploadVideo" action="alert" accept=".mp4" :auto-upload="false" :on-change="loadJsonFromVideo" :on-remove="loadJsonFromVideo">
                <el-button size="small" type="danger" >选择视频</el-button>
              </el-upload>
            </div>
          </el-form-item>
        </el-row>
        <el-row :span="24">
          <el-form-item label="pdf"  prop="pdfAddress" style="width: 700px">
            <div class="button">
              <el-upload :file-list="newUploadPdf" action="alert"  :auto-upload="false" :on-change="loadJsonFromPdf" :on-remove="loadJsonFromPdf">
                <el-button size="small" type="danger" >选择pdf</el-button>
              </el-upload>
            </div>
          </el-form-item>
        </el-row>
        <div class="button">
          <el-button @click="chapterEditorVisble=false;">取消</el-button>
          <!--          这个保存只是暂存章节，最终使用上传按钮上传-->
          <el-button type="danger" @click="updateCourseChapter" >保存</el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="deleteChapterConfirmBox" width="40%">
      <template slot-scope="scope">
        <h1>您确定要删除嘛？</h1>
        <div class="button">
          <el-button @click="deleteChapterConfirmBox=false">取消</el-button>
          <el-button type="danger" @click="deleteCourseChapter(scope.$index)" >确认</el-button>
        </div>
      </template>
    </el-dialog>


  </div>
</template>

<script>

import {
  openCourseChapter,
  getAllCourseType,
  getAllTeacher,
  uploadCourse,
  clearInput
} from "@/services/AdminManageCourse";
import {popMsg} from "@/services/VueMainFunction";
import {cloneObj, getImageBypath} from "@/services/Common";

export default {
  data () {
    return {
      deafaultImage: require("../assets/defaultAddUerImage.png"),
      ifHaveImage:true,
      showPhoto:'',

      loading2 :false, //这个界面不需要加载

      //上传文件部分
      uploadFilename: null,
      uploadExam: [],
      newUploadVideo:[],
      newUploadPdf:[],

      chapterInsertVisible: false,
      uploadSuccessBox: false,
      chapterEditorVisble:false,
      deleteChapterConfirmBox:false,
      // fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
      checked: false,
      chapterUpdataIndex:0,
      chapterList: [],
      teachers: [
        { label: '1 程明', key: 1},
        { label: '2 李献辉', key: 2},
        { label: '3 王岩', key: 3}
      ],
      courseTypes: [
        { label: '1 计算机', key: 1 },
        { label: '2 外语', key: 2 },
        { label: '3 理学', key: 3 },
        { label: '4 工学', key: 4 },
        { label: '5 经济管理', key: 5 },
        { label: '6 艺术设计', key: 6 },
        { label: '7 心理学', key: 7 }
      ],
      insertform: {
        courseName: '',
        teacher: '',
        courseType: '',
        courseIntroduction: {target:'',content:'',object:''},
        addCourseChapter:{name:'',videoAddress:'',pdfAddress:''},
        ifPush:false,//是否推送
        pictureAddress:'',
      },
      rules: {
        courseName: [
          { required: true, message: '请输入课程名称', trigger: 'blur' },
           { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
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
        // chaptername:[{
        //   required: true, message: '请输入章节名称', trigger: 'blur'
        // }]
      }

    }
  },
  methods: {
    //图片问题
    selectPhoto:function(){
      document.getElementById('selectphoto').click()
    },
    //将头像显示
    photoPreview: function (e) {
      let $target = e.target || e.srcElement;
      let file = $target.files[0];
      if (!e || !window.FileReader) return  // 判断是否支持FileReader
      //3M以内
      if(file.size>1024*1024*3){
        this.commonF.popMsg("文件大小不能超过3M！",'warning')
      }
      else{
        const reader = new FileReader();
        reader.onload = (data) => {
          let res = data.target || data.srcElement;
          this.showPhoto = res.result;
          this.ifHaveImage=false
          this.insertform.pictureAddress = '-1'//表示已经更改
        };
        reader.readAsDataURL(file)
      }
      e = null
    },

    /**
     * 刷新文件上传部分
     * 2022年1月17日15:51:55
     */
    updateNewUpload(index=-1){
      if(index<0){
        this.newUploadPdf = []
        this.newUploadVideo = []
      }
      else{
        this.newUploadVideo=[this.chapterList[index].video.video]
        this.newUploadPdf = [this.chapterList[index].pdf.pdf]
      }
    },

    loadJsonFromVideo (file, fileList) {
      //this.uploadFilename = file.name
      console.log(fileList)
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

    //新增删除课程章节 2022年1月12日12:17:29
    deleteCourseChapter(index){
      //rows.splice(index, 1);
      this.deleteChapterConfirmBox=false
      this.chapterList.splice(index,1)
      this.updataChaptertable()
    },

    //新增修改课程章节界面,打开课程章节 1月10 16.30
    openCourseChapter(index){
      this.chapterEditorVisble=true;
      this.updateNewUpload(index)

      //console.log(index)
      this.$refs["updatechapterDateForm"] && this.$refs["updatechapterDateForm"].resetFields();
      this.insertform.addCourseChapter.name = this.chapterList[index].name
      this.chapterUpdataIndex = index
      //this.insertform.addCourseChapter = openCourseChapter()
    },

    //保存修改的课程章节
    updateCourseChapter(){
      this.$refs["updatechapterDateForm"].validate((valid) => {
        if (valid ) {
          if( this.newUploadVideo.length>0){

            this.commonF.popMsg("保存成功!",'success')
            this.chapterEditorVisble=false;
            this.chapterList[this.chapterUpdataIndex] = {
              name: this.insertform.addCourseChapter.name

            }
            this.$forceUpdate()
          }else{
            this.commonF.popMsg("请选择视频!",'error')
            return false;
          }
        } else {
          this.commonF.popMsg("错误提交!",'error')
          return false;
        }
      });

    },

    handleClick4() {
      this.$router.push({
        name:'recommend'
      })
    },

    insert() {
      this.$refs["chapterDateForm"] && this.$refs["chapterDateForm"].resetFields();
      this.$refs["courseDateForm"].validate((valid) => {
        if (valid) {
          this.chapterInsertVisible = true
          this.updateNewUpload()
        } else {
          this.commonF.popMsg("错误提交!",'error')
          return false;
        }
      });
    },

    confirm (){
      this.$refs["chapterDateForm"].validate((valid) => {
      if (valid ) {
        if(this.newUploadVideo.length>0){

          this.commonF.popMsg("添加成功!", 'success')
          const data = {
            name: this.insertform.addCourseChapter.name,
            video: {},
            pdf: {},
          }
        //文件列表推入 id为-1 没有则推入-2 2022年1月18日09:28:47
        if (this.newUploadVideo.length > 0)
          data.video = {id: -1, video: this.newUploadVideo[0]}
        else
          data.video = {id: -2}
        if (this.newUploadPdf.length > 0)
          data.pdf = {id: -1, pdf: this.newUploadPdf[0]}
        else
          data.pdf = {id: -2, pdf: this.newUploadPdf[0]}
        this.chapterList.push(data)
        this.chapterInsertVisible = false
      }else{
          this.commonF.popMsg("请选择视频!",'error')
          return false;
        }
      } else {
        this.commonF.popMsg("错误提交!",'error')
        return false;
      }
    });
    },

    confirm_upload() {
      this.$refs["courseDateForm"].validate(async (valid) => {
        if (valid) {
          this.uploadSuccessBox = true
          if(!this.ifHaveImage)
            this.insertform.pictureAddress = this.showPhoto
          if(await uploadCourse(this.insertform,this.chapterList,this.uploadVideo,this.uploadPdf)){
            this.commonF.popMsg("上传成功!",'success')
            this.$refs["courseDateForm"] && this.$refs["courseDateForm"].resetFields();
            this.chapterList.splice(0,this.chapterList.length);

            this.flushinsertform()//刷新输入框
          }
          // this.$refs["courseDateForm"] && this.$refs["courseDateForm"].resetFields();
        } else {
          this.commonF.popMsg("错误提交!",'error')
          return false;
        }
      });
    },

    /**
     * 刷新输入框
     * 2022年1月17日16:01:10
     */
    flushinsertform(){
      clearInput().then((res)=>{
        this.insertform = res
        })
      this.ifHaveImage = true
      this.showPhoto = ''
      this.$forceUpdate()
    },

    flushTable(){
      getAllTeacher().then((res)=>{
        this.teachers = res
      })
      getAllCourseType().then((res)=>{
        this.courseTypes = res
      })
    }
  },
  created() {
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
.bottom{
  right: 400px;
  position: absolute;
  bottom: 0;
  float: right;
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
.top{
  top: 30px;
  position: relative;
}
</style>
