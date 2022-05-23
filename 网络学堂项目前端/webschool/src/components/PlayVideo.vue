<template>

  <div class="playvideo">
    <!--<div class="top">-->
      <!--<p>-->
        <!--<img src="../assets/ProgramLogo.png" style="width: 378px; height: 64px">-->
        <!--<span class="top_middle">-->
          <!--<el-input v-model="input" placeholder="搜索感兴趣的课程和老师" style="width: 400px"></el-input>-->
          <!--<el-button type="primary" icon="el-icon-search" size="middle" @click="handleClick">搜索</el-button>-->
        <!--</span>-->
        <!--<span class="top_right">-->
          <!--<img src="../assets/litter.png" style="width: 40px; height: 40px; right: 20px">-->
          <!--<el-button type="text" style="color: black; font-size: 18px" @click="handleClick1">个人中心</el-button>-->
          <!--<el-button type="text" style="color: black; font-size: 18px" @click="LogOut">退出</el-button>-->
        <!--</span>-->
      <!--</p>-->
    <!--</div>-->

    <Head></Head>
    <div style="height: 700px;width: 100%;background: #eee">
      <div style="height: 2%"></div>
      <div class="video" v-visibility-change="visibilityChange">
        <div style="height: 5%">
          <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-left: 10px;margin-top: 1%">
            <el-breadcrumb-item :to="{ path: '/CourseDetails' ,query:{courseId:course.id}}">{{course.name}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{currentChapter}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <video-player style="width: 80%;margin-left: 10%;"
                      v-loading="videoLoading"
                      class="video-player vjs-custom-skin"
                      ref="videoPlayer"
                      :playsline="false"
                      :options="playerOptions"
                      @timeupdate="onPlayerTimeupdate($event)"
                      @ended="onPlayerEnded($event)"
                      @ready="playerReadied"
                      @waiting="onPlayerWaiting($event)"
        >
        </video-player>

      </div>

      <div class="menu" style="background: white">
        <div class="item">
          <h2 style="font-weight: bold">{{course.name}}</h2>
        </div>
        <el-divider></el-divider>
        <div class="head-cone" style="line-height: 40px">
          <div class="head-left">
            <h3>&nbsp;&nbsp;视频选集 :</h3>
          </div>
        </div>
        <div class="cur-list" style="top: 30%;left: 70%">
          <ul class="list-box" style="top: 20%;left: 80%" >
            <li class="chapter" v-for="(item,index) in chapterList" :key="index" v-on:click="setIndex(index)">
                <div class="clickitem">
                  <div class="link-content" style="width: 100%">
                    <span class="page-num">P{{index+1}}</span>
                    <span class="part" style="line-height: 30px" >{{item.name}}</span>
                  </div>
                </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="operation">
        <button v-bind:class="{red:!isRed,blue:isRed}" @click="clickCollect" style="border-radius: 20px;height: 40px;width: 120px;margin-left: 10px;margin-top: 20px;color: white;cursor: pointer;float: left" v-show="showCollection">{{ifCollection}}</button>

        <!--<button class="el-icon-download el-icon&#45;&#45;right" @click="downloadPdf" :disabled="!ifNotPdf" style="border-radius: 20px;height: 40px;width: 120px;margin-left: 20px;margin-top: 20px;color: white;cursor: pointer;float: left;background-color: #D9001B;">下载课件</button>-->
        <el-button type="primary" :disabled="!ifNotPdf" @click="downloadPdf" round style="float: right;margin-right: 10px;margin-top: 20px;">下载课件<i class="el-icon-download el-icon--right"></i></el-button>
      </div>
    </div>

  </div>
</template>

<script>
import Head from  './PageHead'
import {
  checkPlayDone, downloadFile,
  getCourseMsgById,
  getStudentChapterTime,
  updateChapterTime,
  updateCollection
} from "@/services/CourseDetails";
import {getImageBypath, getVideoByPath} from "@/services/Common";
import {getCollectionStatus} from "@/services/CourseDetails";
export default {
  name: "playvideo",
  components:{
    Head,
  },
  data() {
    return {
      stuid:-1,
      index:-1,
      cid:-1,
      ifCollection:'',
      showCollection:false,
      screenWidth: '',
      screenHeight: '',
      currentChapter: '第一章',
      input:'',
      //oldTime:0,//上一状态时间
      currentTime:0,//当前时间
      duration:0,//视频总时长
      //maxTime:0,
      time:0,//
      ifPlayDone:false,
      ifNotPdf:false,

      videoLoading:true,
      defaultVideo:require("../../static/video/003.mp4"),//改成默认值
      chapterList:[
        //{id:1,name:'第一章',videoAddress:''},
      ],
      pdf:'',
      course:{
        // id:0, name:'', target:'', content:'', object:'', pictureAddress:'',
        // teacher:{name:'', introduction:''},
        // courseType:{name:'',}
      },
      isRed:true,
      playerOptions: {
        playbackRates: [0.5, 1.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
       // preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: false, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'video/mp4', // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
          src: this.defaultVideo // url地址
        }],
        //poster: require("../assets/litter.png"), // 你的封面地址
        width: 90, // 播放器宽度
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      },
    };
  },
  //props:['cid','chapterList','stuid'], //要改回去的
  methods:{
    /**
     * 视频相关函数
     * 2022年1月15日16:49:29
     */
     onPlayerTimeupdate(player){
       if(this.currentTime>player.cache_.currentTime){
         //this.maxTime = this.currentTime
       }
       else if(this.ifPlayDone||player.cache_.currentTime<this.currentTime+1){
        this.currentTime = player.cache_.currentTime
        //this.maxTime = this.currentTime
         this.time++
        if(this.time>=60){
          this.time-=60
          this.uploadTime(this.currentTime)
        }
      }
      else {
        player.currentTime(this.currentTime)
      }
      if(!this.duration)
        this.duration = player.cache_.duration
    },

    onPlayerWaiting(){
     this.uploadTime(this.currentTime)
    },

    playerReadied(player){
      this.duration = player.cache_.duration
      this.currentTime = 0
    },

    async onPlayerEnded() {
      try {
        await updateChapterTime(this.stuid, this.chapterList[this.index].id, this.duration)
      }catch (err){
        throw Error(err)
      }
    },

    downloadPdf(){
      downloadFile(this.stuid,this.chapterList[this.index].name,this.chapterList[this.index].pdfAddress)
    },

    handleChange(val) {
      console.log(val);
    },

    toMallInfo: function(mallCode){
      this.$router.push({
        path: '/video',
        query: {
          mallCode: 'M000999'
        }
      })
    },

    async setIndex(index){
      this.index = index
      //this.getAddress(this.index)
      this.currentChapter = this.chapterList[index].name
      //console.log(index)
      await this.$router.push({
        path: '/PlayVideo',
        query: {
          //chapterList: this.chapterList,
          courseId:this.cid,
          index: index,
          name: this.currentChapter,
        }
      })
      this.$router.go(0)
    },

    getCourseMsg() {
      const id = this.cid
      this.videoLoading = true
      try {
        getCourseMsgById(id).then((res)=>{
          this.course = res.course
          this.course.id = id
          this.chapterList.splice(0,this.chapterList.length)
          for(let i = 0;i<res.chapterList.length;i++){
            this.chapterList.push(res.chapterList[i])
          }
          this.getAddress(this.index)
          this.$forceUpdate()
        })
      }catch (err){
        throw Error(err)
      }
    },

    getAddress(index){
       try{
         getImageBypath(this.course.pictureAddress).then((res)=>{
           this.playerOptions['poster'] = res
         })
         if(this.chapterList[index].videoAddress!==''){
           getVideoByPath(this.chapterList[index].videoAddress).then((res)=>{
             //this.playerOptions['sources'][0]['src'] = res
             this.playerOptions['sources'][0]['src'] = res;
             //console.log(res)
             this.initPlayerVideoMsg()
           })
         }
         else{
           this.playerOptions['sources'][0]['src'] = this.defaultVideo
           this.videoLoading = false
         }
         this.ifNotPdf = this.chapterList[index].pdfAddress!==''
         this.$forceUpdate()
       }catch (err){
         throw Error(err)
       }

    },

    async uploadTime(current){
      if(this.ifPlayDone)
        return
      if(current<=this.duration){
        await updateChapterTime(this.stuid,this.chapterList[this.index].id,current)
      }
    },//上传观看时间，暂未实现

/*    //这个干吗的？
    change(){
      this.isRed = !this.isRed
    },*/

    clickCollect(){
      updateCollection(this.stuid,this.cid).then((res)=>{
        if(true === res){
          this.isRed = !this.isRed
        }
        if(true === this.isRed){
          this.commonF.popMsg("收藏成功",'success')
          this.ifCollection = '已收藏'
        }
        else{
          this.commonF.popMsg("取消收藏成功",'success')
          this.ifCollection = '未收藏'
        }
      })
    },

    getCollection(){
      getCollectionStatus(this.stuid,this.cid).then((res) => {
        this.isRed = res
        if (true === res) {
          this.ifCollection = '已收藏'
        } else {
          this.ifCollection = '未收藏'
        }
      })
    },

    /**
     * 获取学生学习视频信息    视频初始化是获得
     * 2022年1月15日22:33:22
     * @returns {Promise<void>}
     */
    async initPlayerVideoMsg() {
      try {
        const chapterId = this.chapterList[this.index].id
        this.currentTime = await getStudentChapterTime(this.stuid, chapterId)
        this.ifPlayDone = await checkPlayDone(this.stuid,chapterId)
        this.videoLoading = false
      }catch (err){
        throw Error(err)
      }
    },

    //切换网页暂停视频
    visibilityChange(evt, hidden){
      if(hidden === true){
        this.$refs.videoPlayer.player.pause()
      }
    },

    handleClick() {
      this.$router.push({path:'/result',})
    },
    handleClick1() {
      this.$router.push({path:'/PersonCenter'})
    },
    LogOut() {
      this.$router.push({path:'/Logging'});
      this.commonF.popMsg('退出首页');
    },
  },

  created() {
    /*    for(var i = 0;i<this.chapterList.length;i++){
          this.chapterTitleList.append(this.chapterList[i].name)
        }
        this.setIndex(0);*///得改回来
    // this.getCollection();
    // this.getChapterById();
  },

  //用于网页大小变换后暂停视频
  mounted() {
    this.cid = this.$route.query.courseId; //获取上级页面(课程详情CourseDetails)被点击的章节的id
    //this.index = this.$route.query.index//获取上级页面(课程详情CourseDetails)被点击的章节在list里的索引
    this.index=this.$route.query.index;
    this.currentChapter = this.$route.query.name;
    this.stuid = this.$store.state.userId;//获取用户id
    this.screenWidth = document.body.clientWidth;
    this.screenHeight = document.body.clientHeight;
    this.radio = this.$store.state.radio
    // //获取初始收藏状态
    // getCollectionStatus(this.stuid, this.course.id).then((res)=>{
    //   this.isRed = res
    //   if(true === res){
    //     this.ifCollection = '已收藏'
    //   }
    //   else{
    //     this.ifCollection = '未收藏'
    //   }
    // })
    this.getCourseMsg();
    if('1' === this.radio) {
      this.showCollection = true
      //获取初始收藏状态
      this.getCollection();
    }
    window.onresize = () =>{
      return (() => {
        this.screenWidth = document.body.clientWidth;
        this.screenHeight = document.body.clientHeight;
        if(!this.ifPlayDone)
          this.$refs.videoPlayer.player.pause()
      })();
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >

.red{
  background-color: grey;
}
.blue{
  background-color: #D9001B;
}

.operation{
  height: 12%;
  margin-top: 1%;
  width: 20%;
  float: left;
  margin-left: 2%;
  border-radius: 5px;
  background: white;
}

.item{
  margin-top: 15px;
  margin-left: 15px;
}
.cur-list {
  padding: 4px 0;
}
.cur-list .list-box {
  padding: 0 15px;
  max-height: 350px;
  overflow: auto;
}
.cur-list .list-box li a {
  color: #212121;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
}
.cur-list .list-box li .clickitem {
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  width: 100%;
}
.cur-list .list-box li .link-content {
  display: flex;
  align-items: center;
  flex-shrink: 1;
  width: 60px;
  overflow: hidden;
}
.cur-list .list-box li .page-num {
  margin-right: 10px;
}
.cur-list .list-box li .part {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
}

.video-js .vjs-icon-placeholder {
  width: 16px;
  height: 9px;
  display: block;
}
.video{
  align-content: center;
  vertical-align: center;
  border-radius: 5px;
  height: 95%;
  /*max-width: 1660px;*/
  width: 76%;
  background: white;
  float: left;
  margin-left: 1%;
}
.menu{
  border-radius: 5px;
  height: 80%;
  width: 20%;
  float: left;
  margin-left: 2%;
}

.chapter{
  margin-left: 10px;
}

.chapter:hover{
  background: aliceblue;
}
</style>
