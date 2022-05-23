<template>
  <div>
    <el-container>
    <el-aside width="300px" style="background: #fff;">
      <div class="draw">
        <div class="head_img">
          <img :src="user.image"/>
        </div>

        <div style="text-align: center;font-size: x-large;margin-top: 20px;margin-bottom: 30px">{{name}}</div>

        <br>


      </div>

      <div class="tableTitle"></div>

      <el-button type="danger" plain style="margin-top: 20px;margin-left: 10%;width: 80%" v-on:click="flushAll('账号管理')">账号管理</el-button>
      <el-button type="danger" plain style="margin-top: 20px;margin-left: 10%;width: 80%"  v-on:click="flushAll('我收藏的课程')">收藏</el-button>
      <el-button type="danger" plain style="margin-top: 20px;margin-left: 10%;width: 80%;margin-bottom: 170px" v-on:click="flushAll('学习记录')">历史浏览</el-button>

      <el-button type="danger" round v-on:click="goToLogging" style="margin-top: 40px;margin-left: 10%;width: 80%;">退出登录</el-button>
      <div style="width: 100%;height: 10px"></div>
    </el-aside>

    <el-main >
      <div style="width: 100%;margin-bottom: 30px;">
        <span style="font-size: x-large;margin-left: 40px">{{title}}</span>
        <el-button type="danger" round plain style="float: right;position: relative" v-on:click="goBackIndex">返回首页</el-button>
      </div>

      <div class="tableTitle"></div>

      <div v-show="title === '账号管理'" style="width: 100%;margin-top: 50px;">
        <div style="width: 50%;height: 100% ;float: left;min-width: 500px">
          <el-form ref="user" :model="user" :rules="userRules" label-width="200px">
            <el-form-item label="账号" >
              {{user.username}}
            </el-form-item>
            <el-form-item label="用户名" prop="name">
              <el-input v-model="user.name" style="width: 200px" :disabled="!ifSubmitInformation"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="user.sex"  :disabled="!ifSubmitInformation">
                <el-radio v-model="user.sex" label="男"></el-radio>
                <el-radio v-model="user.sex" label="女"></el-radio>
              </el-radio-group>
            </el-form-item>
            <br>
            <el-form-item label="电话号码" prop="phone">
              <el-input v-model="user.phone" style="width: 300px" :disabled="!ifSubmitInformation"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="邮箱" prop="mail">
              <el-input v-model="user.mail" style="width: 300px" :disabled="!ifSubmitInformation"></el-input>
            </el-form-item>
          </el-form>


            <el-button type="danger" round v-on:click="openPasswordForm('ruleForm')" style="margin-top: 40px;margin-left: 20%;">修改密码</el-button>
            <el-button type="danger" round @click="changePersonalInformation" style="margin-top: 40px;margin-left: 10%;">修改个人信息</el-button>
            <el-button type="danger" round v-show="ifSubmitInformation" style="margin-top: 40px;margin-left: 10%;" v-on:click="saveChange(user)">保存</el-button>
          </div>



          <div style="width: 50%;height: 100% ;float: left;min-width: 500px">
            <div style="width: 500px;border-radius: 10px;background-color: #ddd;">
              <div style="width: 100%;height: 20px"></div>
              <h3 style="margin-left: 20px;">更换头像</h3>
              <div class="modifyImg">
                <div style="width: 100%;float: left;text-align: center;margin-top: 50px">
                    <input type="file" id="file" hidden="" @change="filePreview">
                    <p @click="selectImg()">
                      <img :src="defaultImage" v-if="ifHaveImage" style="height: 10vmax;" alt=""/>
                      <img :src="userPhoto" alt="" style="height: 10vmax" />
                    </p>
                </div>
              </div>
              <div style="width: 100%;height: 40px;text-align: center">
                <h6>请选择图片上传：支持JPG、PNG等格式，图片需小于3M</h6>
              </div>

              <el-button type="danger" round  style="margin-top: 10px;margin-left: 42%;" v-on:click="updateImage">上传</el-button>
              <div style="width: 100%;height: 20px;"></div>
            </div>
          </div>


        <el-dialog title="密码更新" :visible.sync="changePasswordFormVisible">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="旧密码" prop="oldPass" >
              <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off" style="width: 80%;"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass" >
              <el-input type="password" v-model="ruleForm.pass" autocomplete="off" style="width: 80%;"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" style="width: 80%"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button v-on:click="resetPasswordForm('ruleForm')">取 消</el-button>
            <el-button type="primary" v-on:click="submitPasswordForm">确 定</el-button>
          </div>
        </el-dialog>
      </div>

      <div v-show="title === '学习记录'" style="width: 100%;margin-top: 50px">
        <div style="margin-left: 350px">
          <span class="demonstration">条件搜索：&nbsp;&nbsp;&nbsp;</span>
          <el-date-picker
            v-model="startDate"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            style="width: 150px">
          </el-date-picker>


          <span class="demonstration">至</span>
          <el-date-picker
            v-model="endDate"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            style="width: 150px">
          </el-date-picker>
          <span>&nbsp;&nbsp;课程名：</span>
          <el-input placeholder="请输入内容" v-model="searchCourseName" class="input-with-select" style="width: 250px">
            <el-button @click="searchButton" slot="append" icon="el-icon-search"></el-button>
          </el-input>

        </div>

        <el-table v-loading="historyLoading"
          :data="historyTable"
          style="width: 80%;margin-left: 10%;margin-top: 50px">
          <el-table-column
            prop="course"
            label="课程名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="time"
            label="时长"
            width="180">
          </el-table-column>
          <el-table-column
            prop="lastWatchDate"
            label="观看时间">
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5,10,20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageCount"
          style="float:right;top: 20px;position: relative">
        </el-pagination>

      </div>

      <div v-loading="collectionLoading" v-show="title === '我收藏的课程'" style="width: 100%;margin-top: 50px">
        <div style="background: #eee;height: 950px;width: 100%;border-radius: 20px">
          <div class="oneCourse" v-for="(item,index) in courses" :key="index" @click="goToCourseDetails(item)">
            <el-card :body-style="{ padding: '0px', height:'auto'}" shadow="hover">
              <img :src="item.image" style="width: 100%;" alt="无法显示">
              <div style="padding: 16px;">
                <span style="font-size: 20px">{{item.name}}</span>
                <div class="bottom clearfix">
                  <span style="color: darkgray">讲师：</span>
                  <span style="color: darkgray">{{item.teacher.name}}</span>
                </div>
              </div>
            </el-card>
          </div>

          <div style="position: fixed;bottom: 50px;right: 50px">
            <el-pagination
              @current-change="handleCurrentCourseChange"
              :current-page="currentCoursePage"
              :page-size="courseShowNum"
              layout="total, prev, pager, next, jumper"
              :total="courseNum">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-main>

  </el-container>
  </div>
</template>

<script>
import {
  getHistoryPage,
  getCollectionListPage,
  getPersonInformation,
  updatePersonInformation, updataPassword, uploadStudentPhoto
} from "@/services/PersonCenter";
import { getImageBypath} from "@/services/Common";
import {searchHistoryPage} from "@/services/PersonCenter";
import {ajaxFile} from "@/services/ajax";
import axios from "axios";

  export default {
    name: "PersonCenter",
    computed:{
    },
    data(){

      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('密码不能为空'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      const validatePass3 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }
      };
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return{
        defaultImage:require('../assets/defaultAddUerImage.png'),
        ifHaveImage:true,//是否已选择图片
        changePasswordFormVisible: false,
        ifSubmitInformation:false,
        // changePersonalInformationFormVisible:false,
        collectionLoading:true,
        historyLoading:true,
        currentPage: 1, //初始页
        pageSize: 5,    // 每页的数据
        pageCount:1,
        courseShowNum: 6,
        currentCoursePage:1,
        courseNum:1,
        userPhoto:'',
        name:'',
        user:{
          username:'',
          name:'',
          sex:'',
          mail:'',
          phone:'',
          image:'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          password:''
        },
        userRules:{
            name:[
              { required: true, message: '请输入用户名', trigger: 'blur' },
              { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
            ],
            mail:[
              { required: true, message: '请输入邮箱', trigger: 'blur' },
              { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
            ],
          phone:[
            { required: true, message: '请输入电话号码', trigger: 'blur' },
            {  max: 15, message: '长度在15位以内', trigger: 'blur' }
          ]
        },
        ruleForm: {
          pass: '',
          checkPass: '',
          oldPass:'',
        },
        rules: {
          oldPass:[
            {validator: validatePass3, trigger: 'blur'}
          ],
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'}
          ],
        },
        title:'账号管理',
        courses:[
          // {
          //   pictureAddress: '../assets/LoggingBackground.jpg',
          //   image: require('../assets/LoggingBackground.jpg'),
          //   name:'',
          //   teacher: {id:0,name:''},
          // }
          ],

        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },

        startDate: '',
        endDate: '',
        searchCourseName: '',
        checkInsearch:false,
        ifChangePhoto:true,
        historyTable: [],
      };
    },
    methods: {
      //进入收藏课程界面
      goToCourseDetails(item){
        this.$router.push({
          path:'/CourseDetails',
          query: {
            courseId:item.id
          }
        })
      },
      //修改个人信息
      changePersonalInformation(){
        if(!this.ifSubmitInformation)
          this.ifSubmitInformation= true;
        else{
          this.ifSubmitInformation = false;
          this.flushPerson()
        }
      },

      // 初始页currentPage、初始每页数据数pagesize和数据data-->
      handleCurrentChange: function(currentPage){
        this.currentPage = currentPage;
        this.flushTableHistory()

      },
      handleSizeChange: function (size) {
        this.pageSize = size;
        this.flushTableHistory()
      },
      handleCurrentCourseChange: function(currentPage){
        this.currentCoursePage = currentPage;
        this.flushTableCourse()

      },
      openPasswordForm(formName){
        this.changePasswordFormVisible = true;
        this.$refs[formName] && this.$refs[formName].resetFields();
      },
      resetPasswordForm(formName) {
        this.changePasswordFormVisible = false;
      },

      submitPasswordForm() {
        if(this.ruleForm.pass === this.ruleForm.checkPass){
          updataPassword(this.$store.state.userId,this.ruleForm.oldPass,this.ruleForm.pass).then((res)=>{
            if(res){
              this.commonF.popMsg('修改成功','success')
              this.flushPerson()
            }
            else
              this.commonF.popMsg('修改失败','error')
          })
        }
        else
          this.commonF.popMsg('新密码确认失败','error')
        this.changePasswordFormVisible = false;
      },

      selectImg:function(){
        document.getElementById('file').click()
      },

      //将头像显示
      filePreview: function (e) {
        let $target = e.target || e.srcElement;
        let file = $target.files[0];
        //3M以内
        if(file.size>1024*1024*3){
          this.commonF.popMsg("文件大小不能超过3M！",'warning')
        }
        else{
          if (!e || !window.FileReader) return  // 判断是否支持FileReader
          const reader = new FileReader();
          reader.onload = (data) => {
            let res = data.target || data.srcElement;
            this.userPhoto = res.result;
            this.ifHaveImage=false
          };
          reader.readAsDataURL(file)
        }
        e = null
      },

      /**
       * 上传头像按钮     还没做
       * 2022年1月16日18:31:00
       */
      updateImage(){
        if(!this.ifHaveImage&&this.userPhoto!==''){
          uploadStudentPhoto(this.$store.state.userId,this.userPhoto).then((res)=>{
            if(res)
              this.commonF.popMsg('修改成功！','success');
            else
              this.commonF.popMsg('修改失败！','error');
            this.ifHaveImage = true;
            this.userPhoto = '';
            this.flushPerson()
          })
        }
      },

      goToLogging(){
        this.$router.push({path:'/Logging'})
      },

      goBackIndex(){
        this.$router.push({name:'recommend'})
      },

      //保存按钮
      saveChange() {
        if(this.user.name.length > 20){
          this.commonF.popMsg('请重新输入用户名！','error')
        }
        else if(this.user.phone.length > 15){
          this.commonF.popMsg('请重新输入电话号码！','error')
        }
        else if(this.user.mail.length > 30){
          this.commonF.popMsg('请重新输入邮箱！','error')
        }
        else{
          updatePersonInformation(this.$store.state.userId,this.user).then((res)=>{
            if(res)
              this.commonF.popMsg('修改成功！','success')
            else
              this.commonF.popMsg('修改失败！','error')
            this.ifSubmitInformation = false
            this.flushPerson()
          })
        }


      },

      searchButton(){
        if (this.searchCourseName!==''&&this.searchCourseName!==null)
          this.checkInsearch = true
        else if(this.startDate!==''&&this.startDate!==null)
          this.checkInsearch = true
        else if(this.endDate!==''&&this.endDate!==null)
          this.checkInsearch = true
        else
          this.checkInsearch = false
        //     !== '' || this.startDate !== '' || this.endDate !== '';
        // console.log(this.searchCourseName,this.startDate,this.endDate)
        this.flushTableHistory()
      },

      async flushTableHistory() {
        this.historyLoading = true;
        let res = null;
        if (this.checkInsearch) {
          this.currentPage = 1
          res = await searchHistoryPage(this.searchCourseName,this.$store.state.userId,this.currentPage,this.pageSize
          ,this.startDate,this.endDate)
        } else {
          res = await getHistoryPage(this.$store.state.userId, this.currentPage, this.pageSize)
        }
        try {
          this.historyTable = res.studentCourseTimeList
          this.pageCount = res.count
          this.historyLoading = false
        }catch (err){
          throw Error(err)
        }
        this.$forceUpdate()
      },

      flushTableCourse() {
          getCollectionListPage(this.$store.state.userId, this.currentCoursePage, this.courseShowNum).then((res)=>{
          try {
            this.courses = res.courseList;
            this.courseNum = res.count
            for(let i=0;i<this.courses.length;i++){
              getImageBypath(this.courses[i].pictureAddress).then((res)=>{
                this.courses[i].image = res
              })
            }
            this.$forceUpdate()
          }catch (err){
            throw Error(err)
          }
        })
      },

      flushPerson(){
        this.ifSubmitInformation = false
        getPersonInformation(this.$store.state.userId).then((res)=>{
          this.user = res;
          this.name = this.user.name;
          getImageBypath(this.user.photoAdress).then((img)=>{
            this.user.image = img
            this.$forceUpdate();
          })
        })
      },
      flushAll(title){
        this.title = title;
        // this.flushPerson();
        // this.flushTableCourse();
        // this.flushTableHistory();
      },
    },

    created() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        // background: 'rgba(0, 0, 0, 0.7)'
      });
      this.flushPerson();
      this.flushTableCourse();
      this.flushTableHistory();
      loading.close();
    }
  }
</script>

<style scoped>
  .draw{
    /*background-image: url("../assets/PersonCenterUserImageBackground.jpg");*/
    background-size: cover;

  }

  .head_img{
    width: 100%;
  }
  .head_img img{
    margin-top: 20px;
    width:180px;
    height:180px;
    border-radius:50%;
    margin-left: 60px;
  }

  .modifyImg{
    min-height: 300px;
  }
  /*.hiddenInput{*/
    /*display: none;*/
  /*}*/

  .tableTitle {
    position: relative;
    margin: 0 auto;
    width: 100%;
    border-radius: 2px;
    height: 5px;
    background-color: #d4d4d4;
    text-align: center;
    font-size: 16px;
    color: rgba(101, 101, 101, 1);
  }

  .oneCourse{
    height: 300px;
    width: 250px;
    float: left;
    margin-left: 100px;
    margin-top: 60px;
  }
  /*.account-management {*/
    /*position: relative;*/
    /*margin-top: 40px;*/
    /*height: 100%;*/
    /*width: 100%;*/
  /*}*/

  /*.el-card.is-hover-shadow{*/
    /*width: 250px;*/
  /*}*/


</style>
