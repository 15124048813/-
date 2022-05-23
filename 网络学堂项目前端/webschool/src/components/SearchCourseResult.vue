<template>
  <div class="bottom">
    <el-divider></el-divider>
    <el-row>
      <el-button round :class="{filter_active : active == '综合排序'}" @click="selected('综合排序')">综合排序</el-button>
      <el-button round :class="{filter_active : active == '最新发布'}" @click="selected('最新发布')">最新发布</el-button>
      <el-button round :class="{filter_active : active == '最多收藏'}" @click="selected('最多收藏')">最多收藏</el-button>
    </el-row>
    <el-row>
      <el-button round :class="{filter_active : activeForm.active1 == '全部时长'}" @click="selected1('全部时长')">全部时长</el-button>
      <el-button round :class="{filter_active : activeForm.active1 == '10分钟以下'}" @click="selected1('10分钟以下')">10分钟以下</el-button>
      <el-button round :class="{filter_active : activeForm.active1 == '10-30分钟'}" @click="selected1('10-30分钟')">10-30分钟</el-button>
      <el-button round :class="{filter_active : activeForm.active1 == '30-60分钟'}" @click="selected1('30-60分钟')">30-60分钟</el-button>
      <el-button round :class="{filter_active : activeForm.active1 == '60分钟以上'}" @click="selected1('60分钟以上')">60分钟以上</el-button>
    </el-row>
    <el-row>
      <el-button round :class="{filter_active : activeForm.active2 == '全部类别'}" @click="selected2('全部类别')">全部类别</el-button>
      <el-button round v-for="(item,index) in courseType" :key="index" :class="{filter_active : activeForm.active2 == item.type}" @click="selected2(item.type)">{{item.type}}</el-button>
    </el-row>
    <el-divider></el-divider>
    <div class="bottom_top">
      <a class="headline">搜索结果</a>
      <div class="top_right"><el-button type="danger" @click="goBackRecommend">返回推荐</el-button></div>
    </div>
    <el-container class="classbox" v-loading="tableLoading">
      <a class="classbox_item" v-for="(item, index) in result" :key="index" @click="goToCourseDetails(item)">
        <el-card :body-style="{ padding: '0px', height:'auto'}" shadow="hover">
          <img :src="item.picture" style="width: 100%; height: 248px" alt="无法显示">
          <div style="padding: 16px;">
            <span style="font-size: 16px">{{item.name}}</span>
            <div style="margin-top: 10px">
              <span style="color: darkgray; left: 0; font-size: 14px">讲师：</span>
              <span style="color: darkgray; font-size: 14px">{{item.teacher}}</span>
            </div>
            <div style="margin-top: 10px">
              <span style="color: darkgray; left: 0; font-size: 14px">上传时间：</span>
              <span style="color: darkgray; font-size: 14px">{{ dateStr(item.time) }}</span>
            </div>
          </div>
        </el-card>
      </a>
    </el-container>
    <el-empty description="暂无搜索结果" v-show="ifResultEmpty"></el-empty>
  </div>
</template>

<script>
import {
  searchCollectionCount,
  searchCourseByCourseName,
  searchCourseByTeacherName,
  searchCourseByType,
  searchCourseUploadTime,
  searchVideoLength
} from "../services/SearchCourseResult";
import {getAllClassType} from "../services/CourseRecommend";
import {getImageBypath} from "../services/Common";
  export default {
    name: "result",
    data(){
      return{
        ifResultEmpty:false,
        radio:'',
        courseType:[],
        active: '综合排序',
        tableLoading:true,
        activeForm:{
          active1: '全部时长',
          active2: '全部类别',
        },
        result:[],
        classList:[],
      }
    },
    async created() {
      this.classList = []
      this.$forceUpdate()
      await this.getData()
      this.radio = this.$route.query.raido
      this.result = this.classList
    },
    watch:{
      activeForm:{
        handler:function(val) {
          this.result = this.classList.filter(
            (item) => {
              let flag1 = false;
              let flag2 = false;
              if(this.activeForm.active1 == '全部时长'){
                flag1 = true;
              }else if(this.activeForm.active1 == '10分钟以下'){
                if(item.length < 10){
                  flag1 = true;
                }
              }else if(this.activeForm.active1 == '10-30分钟'){
                if(item.length < 30 && item.length >= 10){
                  flag1 = true;
                }
              }else if(this.activeForm.active1 == '30-60分钟'){
                if(item.length < 60 && item.length >= 30){
                  flag1 = true;
                }
              }else if(this.activeForm.active1 == '60分钟以上'){
                if(item.length >= 60){
                  flag1 = true;
                }
              }
              if(this.activeForm.active2 == item.type || this.activeForm.active2 == '全部类别'){
                flag2 = true;
              }
              if(flag1 && flag2){
                return item;
              }
            }
          );
        },

        deep:true
      }
    },
    methods:{
      //时间转换
      dateStr(d, sign) {
        //如果没有传递符号，给一个默认的符号
        if (!sign) {
          sign = '-'
        }
        //获取d里面年月日时分秒
        let year = d.getFullYear(),
          month = d.getMonth() + 1,
          sun = d.getDate()
        return (
          year +
          sign +
          this.mendZero(month) +
          sign +
          this.mendZero(sun)
        )
      },
      //时间转换补零
      mendZero(num) {
        return (num = num < 10 ? '0' + num : num)
      },
      unique(arr) {
        const res = new Map();
        return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
      },
      async getData() {
        this.courseType = await getAllClassType();
        let typeId = this.$route.query.typeId
        let typeName = this.$route.query.typeName
        let searchCourseText = this.$route.query.searchCourseText
        let bycoursename = await searchCourseByCourseName(searchCourseText)
        let byteachername = await searchCourseByTeacherName(searchCourseText)
        for (let i = 0; i < byteachername.length; i++) {
          bycoursename.push(byteachername[i])
        }
        let bycoursetypeid = undefined === typeId ? [] : await searchCourseByType(typeId)
        for (let i = 0; undefined !== typeId && i < bycoursetypeid.length; i++) {
          bycoursename.push(bycoursetypeid[i])
        }
        let data = this.unique(bycoursename) //去重

        this.tableLoading = true
        this.classList = []
        let courseIdList = []
        for (let i = 0; i < data.length; i++) {
          courseIdList.push(data[i].id)
          const course = {
            name: data[i].name,
            picture: data[i].pictureAddress,
            time: "",//下面会获取
            collect: -1,//下面会获取
            length:-1,//下面会获取
            id: data[i].id,
            type: undefined === typeId ? data[i].courseType.type : typeName,
            teacher: data[i].teacher.name
          }
          getImageBypath(course.picture).then((res) => {
            course.picture = res
          })
          this.classList.push(course)
        }
        let dateList = await searchCourseUploadTime(courseIdList)
        let collectList = await searchCollectionCount(courseIdList)
        let videoLength = await searchVideoLength(courseIdList)
        for(let i = 0; i < this.classList.length; i++){
          this.classList[i].time = new Date(dateList[i])
          this.classList[i].collect = collectList[i]
          this.classList[i].length = videoLength[i]
        }
        if(undefined !== typeId){
          this.selected2(typeName)
        }
        if(this.classList.length === 0){
          this.ifResultEmpty = true
        }
        else this.ifResultEmpty = false

        this.tableLoading = false
      },
      goToCourseDetails(item){
        this.$router.push({
          path:'/CourseDetails',
          query: {
            courseId:item.id
          }
        })
      },
      goBackRecommend() {
        this.$router.push({name:'recommend'})
      },
      selected(name){
        this.active = name;
        if(name == '最新发布'){
          this.result.sort(this.time_sort)
        } else if(name == '最多收藏' ){
          this.result.sort(this.collect_sort)
        } else if(name == '综合排序'){
          this.result.sort(this.id_sort)
        }
      },
      selected1(name){
        this.activeForm.active1 = name;
        this.ifResultEmpty =true;
      },
      selected2(name){
        this.activeForm.active2 = name;
        this.ifResultEmpty =true;
      },
      time_sort(a, b){
        return b.time - a.time;
      },
      collect_sort(a, b){
        return b.collect - a.collect
      },
      id_sort(a ,b){
        return a.id - b.id
      }
    }
  }
</script>

<style scoped>
  .bottom{
    position: relative;
    margin-left: 60px;
    margin-right: 60px;
    /*background-color: blueviolet;*/
  }

  .bottom-wrapper{
    height: 400px;
  }

  .list_box{
    position: fixed;
    padding-top: 6px;
    right: 20px;
    bottom: 50px;
    background: #fff;
    border: 1px solid #e7e7e7;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    z-index: 2
  }

  .list_box .item {
    width: 54px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    cursor: pointer;
    transition: all .2s;
    -ms-user-select: none;
    user-select: none;
    background: #fff;
    font-size: 16px;
  }

  .active{
    color: #D9001B;
  }

  .filter_active{
    background: #D9001B;
    border: 1px solid #D9001B;
    color: #fff;
  }

  .headline{
    position: relative;
    height: 34px;
    top: 20px;
    left: 10px;
    text-align: left;
    font-size: 24px;
    font-weight: bold;
    color: #D9001B;
    border-bottom: 4px solid #D9001B

  }

  .top_right{
    position: absolute;
    right: 10px;
    top: 10px;
    line-height: 5px;
  }

  .classbox{
    display: flex;
    flex-wrap: wrap;
    height: auto;
    overflow: auto;
    justify-content: left;
    align-items: center;
    align-content: center;
    margin-top: 30px;
    margin-right: 100px;
    margin-left: 100px;
  }

  .classbox_item{
    width: 200px;
    margin: 20px;
  }

  .classname{
    bottom: 0px;
    color: black;
    margin-top: 4px;
  }

  .el-row {
    margin-bottom: 20px;
    left: 40px;
    /*&:last-child {*/
    /*margin-bottom: 0;*/
    /*}*/
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }


  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }




</style>
