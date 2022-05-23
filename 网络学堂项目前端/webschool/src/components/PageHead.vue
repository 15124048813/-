<template>
    <div style="height: 80px;width: 100%;background: #d9aeae;min-width: 1520px">
      <div style="float: left;margin-left: 80px;margin-top: 15px;cursor: pointer;" v-on:click="goBackHomePage" >
        <img src="../assets/ProgramLogo.png" style="width: 279px; height: 48px">
      </div>

      <div style="margin-left: 80px;float: left;margin-top: 20px">
        <el-dropdown>
          <span class="el-dropdown-link">
            课程类别<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(courseType,index) in classType" :key="index" @click.native ="searchCourseByType(courseType)">{{courseType.type}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>


        <el-popover
          placement="top"
          title="抽象工作组"
          width="400"
          trigger="hover"
          :content="selfIntroduction"
          style="margin-left: 40px">
          <el-button slot="reference" style="border: 0;color:  #D9001B;background: transparent">关于我们</el-button>
        </el-popover>
      </div>


      <div style="width: 400px;margin-left: 100px;float: left;margin-top: 20px">
       <span class="top_middle">
         <el-input v-model="searchCourseText" placeholder="搜索感兴趣的课程" @keyup.native.enter="searchRelativeCourse" style="width:250px" clearable></el-input>
         <button style="height: 38px;width: 70px;cursor: pointer;border-radius: 5px;border: 0;background: #D9001B;color: ghostwhite;margin-left: 20px" @click="searchRelativeCourse" class="el-icon-search">&nbsp;搜索</button>
        </span>
      </div>
      <div>
        <img :src="userImage" style="width: 40px; height: 40px;border-radius:50%;margin-left: 5%;margin-top: 20px">
        <span class="top_right">
          <!--<span style="margin-right: 30px">{{userName}}</span>-->
          <!--<el-badge :value="12" style="margin-right: 20px">-->
            <!--<el-button type="text" style="font-size: 18px;color: red">消息</el-button>-->
          <!--</el-badge>-->
          <el-button type="text" style="font-size: 18px;color: red" v-on:click="goToCenter(1)" v-if="identity==='1'">个人中心</el-button>
          <el-button type="text" style="font-size: 18px;color: red" v-on:click="goToCenter(2)" v-if="identity==='2'">管理员中心</el-button>
          <el-button type="text" style="font-size: 18px;color: red" v-on:click="goBackLogging">退出登录</el-button>
        </span>
      </div>
    </div>
</template>

<script>
import {
  getAllClassType
} from "@/services/CourseRecommend";
import {getPersonInformation} from "@/services/PersonCenter";
import {getImageBypath} from "@/services/Common";

export default {
  name: "PageHead",

  data() {
    return {
      userImage: require('../assets/PersonCenterUserImageBackground.jpg'),
      userName:'',
      searchCourseText:'',
      selfIntroduction:'噫吁嚱，危乎高哉！蜀道之难，难于上青天！蚕丛及鱼凫，开国何茫然！尔来四万八千岁，不与秦塞通人烟。西当太白有鸟道，可以横绝峨眉巅。地崩山摧壮士死，然后天梯石栈相钩连。上有六龙回日之高标，下有冲波逆折之回川。黄鹤之飞尚不得过，猿猱欲度愁攀援。青泥何盘盘，百步九折萦岩峦。扪参历井仰胁息，以手抚膺坐长叹。\n' +
        '问君西游何时还？畏途巉岩不可攀。但见悲鸟号古木，雄飞雌从绕林间。又闻子规啼夜月，愁空山。蜀道之难，难于上青天，使人听此凋朱颜！连峰去天不盈尺，枯松倒挂倚绝壁。飞湍瀑流争喧豗，砯崖转石万壑雷。其险也如此，嗟尔远道之人胡为乎来哉！\n' +
        '剑阁峥嵘而崔嵬，一夫当关，万夫莫开。所守或匪亲，化为狼与豺。朝避猛虎，夕避长蛇；磨牙吮血，杀人如麻。锦城虽云乐，不如早还家。蜀道之难，难于上青天，侧身西望长咨嗟。',
      courseTypeList:[],
      classType:[]//课程类别
    };
  },
  computed: {
    identity: function () {
      return this.$store.state.radio
    }
  },
  async mounted() {
    this.classType = await getAllClassType();
    this.searchCourseText = this.$route.query.searchCourseText
    await this.getPerson()
  },
  methods: {
    async searchCourseByType(courseType){
      await this.$router.push({
        name:'result',
        query:{
          typeId:courseType.id,
          typeName:courseType.type
        }
      });
      this.$router.go(0)
    },
    async searchRelativeCourse() {
       await this.$router.push({
        name:'result',
        query:{
          searchCourseText:undefined === this.searchCourseText ? "" : this.searchCourseText
        }
      });
      this.$router.go(0)
    },
    goToCenter(val){
      if(val === 1)
        this.$router.push({path:'/PersonCenter'});
      else
        this.$router.push({path:'/Administrator'});
    },
    goBackLogging(){
      this.$router.push({path:'/Logging'});
    },
    goBackHomePage(){
      this.$router.push({path:'/HomePage'});
    },

    /**
     * 获取头像和姓名
     * 2022年1月19日15:25:43
     */
    async getPerson() {
      try {
        const res = await getPersonInformation(parseInt(this.$store.state.userId))
        this.userName = res.name
        this.userImage = await getImageBypath(res.photoAdress)
        this.$forceUpdate()
      }catch (err){
        throw Error(err)
      }
    },
  },

}
</script>

<style scoped>
  .top_right{
    position: relative;
    top: -15px;
    right: -20px;
    line-height: 5px;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #D9001B;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }

</style>
