<template>
  <div>
    <span class="wenzi">查看学习时长</span>
    <div class="button"><el-button  type="danger" @click="handleClick4" plain>返回首页</el-button></div>
    <div class="topcolor"></div>
    <div class="top">
      <el-main>
      <div>
        <span class="block" style="left: 0px;position: relative">
              <el-date-picker v-model="value2" type="daterange" align="left" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </span>
        <span><el-input v-model="searchInput" style="width: 400px;left:255px;position: relative" placeholder="请输入内容" @keyup.native.enter="flushTable" clearable></el-input></span>
        <span><el-button @click="flushTable" style="width: 100px;left:275px;position: relative"  type="danger" round>搜索</el-button></span>
        <div style="height: 15px"></div>
        <el-table
          v-loading="LearningTiemTableLoading"
          :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
          stripe
          style="width: 100%;text-align: center">
          <el-table-column
            prop="id"
            label="编号"
            width="400"
            align="center">
          </el-table-column>
          <el-table-column
            prop="studentName"
            label="学生姓名"
            width="320"
            align="center">

          </el-table-column>
          <el-table-column
            prop="time"
            label="学习时长"
            width="400"
            align="center">
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.length"
          style="float:right;top: 20px;position: relative">
        </el-pagination>
      </div>
      </el-main>
    </div>
  </div>
</template>

<script>
import {getAllStudentLearningTime, searchStudentLearningTime} from "@/services/AdminSeeUserLearningDuration";

export default {

  data() {
    return {
      LearningTiemTableLoading:true,
      currentPage: 1, //初始页
      pagesize: 5,    // 每页的数据
      searchInput:'',
      tableData: [{
        id: '12345',
        studentName: '小1',
        time:'100h',
      }],
      pickerOptions1: {
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
      value2: ''
    };
  },
  methods:{
    // 初始页currentPage、初始每页数据数pagesize和数据data-->
    handleClick4() {
      this.$router.push({
        name:'recommend'
      })
    },
    handleSizeChange: function (size) {
      this.pagesize = size;
      //console.log(this.pagesize)  //每页下拉显示数据-->
    },
    handleCurrentChange: function(currentPage){
      this.currentPage = currentPage;
      //console.log(this.currentPage)  //点击第几页
    },

    async flushTable() {
      this.LearningTiemTableLoading = true
      if(this.searchInput!=='')
        this.tableData = await searchStudentLearningTime(this.searchInput)
      else {
        this.tableData = await getAllStudentLearningTime()
      }
      this.LearningTiemTableLoading = false


      this.$forceUpdate()
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
