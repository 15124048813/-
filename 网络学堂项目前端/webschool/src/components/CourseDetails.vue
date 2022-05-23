<template>
  <div>
    <Head></Head>
    <div style="background-color: #FFFFFF; height: 2px; width: 100%"></div>
    <div class="bottom">
      <div class="bottom-top">
        <div class="bottom-top-context">
          <div class="course-image"><!--课程封面-->
            <!--课程封面图片-->
            <img :src="pictureAddress" style="border-radius: 8px;vertical-align: top;width: 510px;height: 300px;aspect-ratio: auto 510 / 300;" alt="无法显示课程封面">
          </div>
          <div class="course-name-and-teacher"><!--课程名以及讲师名和讲师简介-->
            <div class="course-title"><!--课程名和收藏按钮栏-->
              <div class="course-name">
                {{ cname }}
              </div>
              <div class="collect" v-show="showCollection">
                <button v-bind:class="{red:isRed,blue:!isRed}" @click="clickCollect" style="border-radius: 20px;height: 32px;width: 60px;color: white;cursor: pointer">{{ifCollection}}</button>
              </div>
            </div>
            <div class="teacher"><!--讲师名和讲师信息框-->
              <div class="s-title">
                讲师介绍
              </div>
              <div class="teacher-photo">

                <!--  讲师图片-->
                <img :src="teacher.teacherPictureAddress" style="float: left; border-radius: 4px;vertical-align: top;width: 120px;height: 160px;aspect-ratio: auto 120 / 160;" alt="无法显示讲师照片"/>
              </div>
              <div>
                <div style="position: relative; float: left; margin-left: 10px; padding: 3px; height: 32px; width: 250px; font-size: 18px;font-weight: bold;color: #D9001B;">
                  {{teacher.tname}}
                </div>
                <div class="teacher-introduction">
                  {{teacher.introduction}}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div class="small-bar"></div><!--空白占位框-->
      <div class="bottom-bottom">
        <el-tabs v-model="activeName" @tab-click="handleClick" stretch>
          <el-tab-pane label="课程详情" name="course-desc">
            <div class="course-introduction">
              <div class="introduction">
                <div class="s-title">
                  针对对象
                </div>
                <div class="course-introduction-object">
                  {{courseIntroduction.object}}
                </div>
              </div>
              <div class="introduction">
                <div class="s-title">
                  课程目标
                </div>
                <div class="course-introduction-target">
                <span style="top: 150px">
                  {{courseIntroduction.target}}
                </span>
                </div>
              </div>
              <div class="introduction">
                <div class="s-title">
                  主要内容
                </div>
                <div class="course-introduction-content">
                  {{courseIntroduction.content}}
                </div>
              </div>
            </div>
            <div style="width: 200px; float: right;">
              <el-table
                :data="chapterList"
                @row-click="rowHandleClick"
                :row-class-name = "getRowIndex"
                height="400"
                border
                style="width: 200px; background-color: #f9f9f9">
                <el-table-column
                  prop= "name"
                  label="章节"
                  width="199px"
                  style="background-color: #ffffff"
                >
                </el-table-column>
              </el-table>
              <div>
                <el-button @click="jump()" round style="margin-top: 10px; float: right" type="primary">前往考试</el-button>
              </div>
            </div>

          </el-tab-pane>
          <el-tab-pane label="交流讨论" name="discussion">
            <el-empty description="这里还无人交流..."></el-empty>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="small-bar"></div><!--空白占位框框-->
    </div>
  </div>

</template>

<script>
import {
  getCourseMsgById
} from "@/services/CourseDetails";

import Head from "./PageHead"
import {
  getCollectionStatus,
  updateCollection
} from "../services/CourseDetails";
import {getImageBypath, popMsg} from "../services/Common";
export default {
  components:{
    Head
  },
  name: "CourseDetails",
  data() {
    return {
      isRed:true,
      stuid:-1,
      courseId:-1,
      ifCollection:'',
      showCollection:false,
      radio:'',
      activeName: 'course-desc',
      cname:'',
      courseIntroduction: {target:'',content:'',object:''},
      teacher:{
        tname: '',
        introduction: '',
        teacherPictureAddress:'',
      },
      pictureAddress:'',
      course:{
        id:-1,
        name:'',
        target:'',
        content:'',
        object:'',
        pictureAddress:'',
        teacher:{
          name:'',
          introduction:''
        },
      },
      chapterList:[],
    }
  },
  props:['cid'],
  methods: {
    handleClick(tab, event) {
    },
    clickCollect(){
      updateCollection(this.stuid,this.courseId).then((res)=>{
        if(true === res){
          this.isRed = !this.isRed
        }
        if(true === this.isRed){
          popMsg('success',"收藏成功");
          this.ifCollection = '已收藏'
        }
        else{
          popMsg('success',"取消收藏成功");
          this.ifCollection = '未收藏'
        }
      })
    },
    toMallInfo() {
      this.$router.push({
        path: '/PlayVideo',
        query: {
          mallCode: 'M000989'
        }
      })
    },
    handleClick1() {
      this.$router.push({path: '/PersonCenter'})
    },
    getRowIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },
    rowHandleClick(row) {
      // alert(row.index);
      // alert('前往章节视频页面');
      this.$router.push({
        path: '/PlayVideo',
        query: {
          //chapterList: this.chapterList,
          courseId:this.courseId,
          index: row.index - 1,
          name: row.name,
        }
      })
    },
    jump() {
      window.open("https://www.kaoshixing.com/login/account/login/383789");
    },
  },
  async created() {
    this.courseId = this.$route.query.courseId//获取上及页面传来的课程id
    this.stuid = this.$store.state.userId//获取用户id
    this.radio = this.$store.state.radio
    if('1' === this.radio) {
      this.showCollection = true
      //获取初始收藏状态
      getCollectionStatus(this.stuid, this.courseId).then((res) => {
        this.isRed = res
        if (true === res) {
          this.ifCollection = '已收藏'
        } else {
          this.ifCollection = '未收藏'
        }
      })
    }
    //初始化课程信息
    await getCourseMsgById(this.courseId).then((res) => {
      this.cname = res.course.name
      this.courseIntroduction = {
        target: res.course.target,
        content: res.course.content,
        object: res.course.object
      }
      this.teacher = {
        tname: res.course.teacher.name,
        introduction: res.course.teacher.introduction,
        teacherPictureAddress: res.course.teacher.photoAddress
      }
      getImageBypath(this.teacher.teacherPictureAddress).then((res)=>{
        this.teacher.teacherPictureAddress = res
      })
      this.pictureAddress = res.course.pictureAddress
      getImageBypath(this.pictureAddress).then((res)=>{
        this.pictureAddress = res
      })
      this.course = {
        id:res.course.id,
        name:res.course.name,
        target:res.course.target,
        content:res.course.content,
        object:res.course.object,
        pictureAddress:this.pictureAddress,
        teacher: {name:res.course.teacher.name,introduction:res.course.teacher.introduction},
      }
      for(let i = 0;i < res.chapterList.length;i++){
        let chapter = {
          name:res.chapterList[i].name,
          id:res.chapterList[i].id,
        }
        this.chapterList.push(chapter)
      }
    })
  }
}
</script>

<style scoped>
html,body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.bottom{
  position: relative;
}
.small-bar {
  position: relative;
  width: 100%;
  height: 25px;
}
.bottom-top {
  position: relative;
  height: 300px;
  width: 100%;
  padding: 25px 0 55px;
  background: #ffffff;
}
.bottom-top-context {
  position: relative;
  height: 300px;
  width: 950px;
  margin: 0 auto;
}

.bottom-bottom {
  position: relative;
  width: 870px;
  margin: 0 auto;
  padding: 0 40px 20px 40px;
  background-color: #ffffff;
  border-radius: 12px;
}

.course-image {
  position: relative;
  float: left;
  width: 510px;
  height: 300px;
  margin-left: 0;
  margin-right: -225px
}
.course-name-and-teacher {
  position: relative;
  float: right;
  width: calc(100% - 510px - 30px);
}
.course-title {
  position: relative;
  height: 65px;
}
.collect {
  position: absolute;
  right: 0;
}
.course-name {
  position: relative;
  max-width: 350px;
  text-align: left;
  font-size: 24px;
  font-weight: bold;
  color: #D9001B;
  float: left;
}
.course-introduction {
  position: relative;
  width: 600px;
  float: left;
}
.introduction {
  margin-bottom: 40px;
}

.teacher {
  position: relative;
  height: 215px;
  padding: 10px;
  border-radius: 10px;
  background-color: #f8f8f8;
}
.s-title {
  position: relative;
  padding: 3px;
  height: 34px;
  text-align: left;
  font-size: 18px;
  font-weight: bold;
  color: #D9001B;
}

.teacher-introduction {
  position: relative;
  font-size: small;
  /*height: 80px;*/
  max-height: 120px;
  max-width: 250px;
  margin-left: 10px;
  padding: 3px;
  float: left;
}

.red{
  background-color: #D9001B;
}
.blue{
  background-color: grey;
}
</style>
