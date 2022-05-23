<template>
  <div class="bottom">
    <div class="headline"><span style="border-bottom: 4px solid #D9001B">推荐课程</span></div>
    <el-carousel :interval="4000" type="card" height="400px">
      <el-carousel-item v-for="(item,index) in pushCourses" :key="index" @click.native=" goToCourseDetails(item)">
        <img :src="item.picture" height="400px" width="100%" alt="" v-loading="pushCoursesLoading">
      </el-carousel-item>
    </el-carousel>
    <div ref="navWrapper" class="bottom-wrapper" v-for="(item,index) in classType" :key="index">
      <div class="headline">
        <div class="el-icon-video-camera-solid" style="background: rgba(238,200,200,0.2);border-top-right-radius: 10px;border-top-left-radius: 10px;width: 250px;text-align: center;height: 50px">{{item.type}}</div>
        <!--<span style="border-bottom: 4px solid #D9001B">{{item.type}}</span>-->
      </div>
      <div class="classbox">
        <div class="classbox_item" v-for="(menu,index) in item.children.slice(0,5)" :key="index">
          <el-card :body-style="{ padding: '0px', height:'auto'}" shadow="hover" v-loading="courseLoading">
            <img :src="menu.picture" style="width: 100%;height:248px" alt="无法显示" @click = "goToCourseDetails(menu)">
            <div style="padding: 10px;" @click = "goToCourseDetails(menu)">
              <span style="font-size: 16px">{{menu.title}}</span>
              <div class="bottom clearfix" style="margin-top: 10px;">
                <span style="color: darkgray; left: 0; font-size: 14px">讲师：</span>
                <span style="color: darkgray; font-size: 14px">{{menu.teacher}}</span>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <div style="height: 20px"></div>
    <div class="list_box">
      <div v-for="(item,index) in classType" :key="index" class="item" @click="jump(index)" :class="{'active' : activeMenu == index}">{{item.type}}</div>
      <!--<HR/>-->
      <div class="el-icon-caret-top" style="text-align: center;margin-top: 10px;cursor: pointer" @click="jump(-1)"></div>
    </div>
  </div>
</template>

<script>
import {
  getAllClassType,
  getAllClassByType,
  getPushCourses, normalizeClass,
} from "../services/CourseRecommend";

export default {
  name: "recommend",
  data(){
    return{
      activeMenu: -1, //菜单索引
      classType:[],//课程类别和其下所有课程
      pushCourses:[],//推送课程
      pushCoursesLoading:true,
      courseLoading:true,
    }
  },
  methods:{
    goToCourseDetails(item){
      this.$router.push({
        path:'/CourseDetails',
        query: {
          courseId:item.courseId
        }
      })
    },
    jump(i) {
      if(i === -1){
        window.scrollTo({top: 0, behavior: 'smooth'})
      }
      else {
        this.activeMenu = i;
        window.scrollTo({top: this.$refs.navWrapper[i].offsetTop < 0 ? 0 : this.$refs.navWrapper[i].offsetTop, behavior: 'smooth'})
        // document.documentElement.scrollTop = this.$refs.navWrapper[i].offsetTop;
      }

    },
    handleScroll(){
      let arr = this.$refs.navWrapper;
      let scrollY = window.scrollY;
      if (scrollY < 400) {
        this.activeMenu = -1;
      }
      for (let i = 0; i < arr.length; i++) {
        if (scrollY + 50 > arr[i].offsetTop) {
          this.activeMenu = i;
        }
      }
    },
    async getData() {
      this.pushCoursesLoading = true
      this.pushCourses = await getPushCourses()
      this.pushCoursesLoading = false
      const types = await getAllClassType();
      this.courseLoading = true
      this.classType = []
      for (let i = 0; i < types.length; i++) {
        const type = {
          type: types[i].type,
          children: await getAllClassByType(types[i].id),
        };
        this.classType.push(type)
      }
      this.courseLoading = false
    }
  },
  async created() {
    window.addEventListener("scroll", this.handleScroll, true);
    await this.getData();
  }
}
</script>

<style scoped>
  .bottom{
    /*text-align: center;*/
    position: relative;
    /*background-color: blueviolet;*/
  }

  .bottom-wrapper{
    height: auto;
    margin-bottom: 30px;
  }

  .list_box{
    text-align: center;
    position: fixed;
    padding-top: 6px;
    padding-bottom: 6px;
    right: 20px;
    bottom: 50px;
    background: #fff;
    border: 1px solid #e7e7e7;
    border-radius: 10px;
    z-index: 2

  }

  .list_box .item {
    width: auto;
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

  .headline{
    /*position: relative;*/
    /*margin-left: 20px;*/
    top: 20px;
    /*left: 10px;*/
    text-align: left;
    font-size: 26px;
    font-weight: bold;
    color: #D9001B;
    /*border-bottom: 4px solid #D9001B*/

  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .classbox{
    /*border-top: 2px solid #ff4d51;*/
    border-radius: 20px;
    border-top-left-radius: 0px;
    background: rgba(238,200,200,0.2);
    display: flex;
    flex-wrap: wrap;
    height: 360px;
    overflow: auto;
    justify-content: left;
    /*align-items: center;*/
    /*align-content: center;*/

  }

  .classbox_item{
    width: 250px;
    margin: 20px;
  }

  .classname{
    bottom: 0;
    color: black;
    margin-top: 4px;
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
