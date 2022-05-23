<template>
    <el-row>
      <div class="left">
        <div class="photo" ><img src="../assets/litter.png" style="border-radius: 50%">
        </div><div class="wenzi">管理员</div>
        <div class="biaoqian">
          <el-row>
            <el-tabs >
              <div class="button"><el-button @click="tabchange(1)" type="danger" plain style="width: 130px">上传课程</el-button></div>
              <div class="button"><el-button @click="tabchange(2)"  type="danger" plain style="width: 130px">管理课程</el-button></div>
              <div class="button"><el-button @click="tabchange(3)"  type="danger" plain style="width: 130px">管理讲师信息</el-button></div>
              <div class="button"><el-button @click="tabchange(4)" type="danger" plain style="width: 130px">查看学习时长</el-button></div>
              <el-button type="danger" round v-on:click="goToLogging" style="margin-top: 600px;margin-left: 10%;width: 80%;">退出登录</el-button>
            </el-tabs>
          </el-row>
        </div>
      </div>
      <div class="right">
        <chuan v-if="tab===1"></chuan>
        <guan v-if="tab===2"></guan>
        <jiangshi v-if="tab===3"></jiangshi>
        <shichang v-if="tab===4"></shichang>
      </div>

    </el-row>
</template>

<script>
import chuan from "./AdminUploadCourse"
import guan from "./AdminManageCourse"
import jiangshi from "./AdminOperateInstructorInformation"
import shichang from "./AdminSeeUserLearningDuration"
export default {
  name: 'Administrator',
  components: {
    chuan,
    guan,
    jiangshi,
    shichang
  },
  data () {
    return {
      tab: 1

    };
  },
  methods: {
    tabchange:function (id){
      this.tab = id;
    },
    goToLogging(){
      this.$router.push({path:'/Logging'})
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
.left{
  background: rgba(211, 220, 230, 0.76);
  height: 1200px;
  width: 235px;
  position: absolute;
}

.right{
  height: 1200px;
  width: 1167px;
  left: 235px;
  position: absolute;
  /*background: #E9EEF3;*/
}

.photo{
  text-align: center;
  position: relative;
  top: 30px;
  height: 13%;
}
.wenzi{
  position: relative;
  font-size: 30px;
  text-align: center;
}
.biaoqian{
  top: 50px;
  width: 100%;
  position: relative;
}
.button{
  text-align: center;
  padding-top: 20px;
  position: relative;
}
</style>
