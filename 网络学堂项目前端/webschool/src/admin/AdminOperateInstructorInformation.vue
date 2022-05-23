<template>
  <div>
    <span class="wenzi">管理讲师信息</span>
    <div class="button"><el-button  type="danger"  @click="handleClick4" plain>返回首页</el-button></div>
    <div class="topcolor"></div>

  <div class="top">
    <el-main>
      <div>
        <span><el-input v-model="searchInput" style="width: 400px;left:435px;position: relative" placeholder="请输入内容" @keyup.native.enter="searchTeacherButton" clearable></el-input></span>
        <span><el-button style="width: 100px;left:455px;position: relative"  type="danger" @click="searchTeacherButton" round>搜索</el-button></span>
        <span><el-button style="width: 150px;left:475px;position: relative" type="danger"  icon="el-icon-plus" @click="insert" round>添加讲师</el-button></span>
        <div style="height: 15px"></div>
        <el-dialog :visible.sync="teacherInsertVisible" width='900px'>
          <el-form
            :rules="rules"
            :model="insertfrom"
            ref="dataForm1"
            label-position="left"
            label-width="90px"
            style="width: 700px; margin-left:50px;">
            <el-form-item label="讲师图片" style="width:700px" prop="photoAddress">
                <input type="file" id="selectImage" hidden="" @change="filePreview">
                <p @click="selectImg()" >
                  <img :src="deafaultImage" v-if="ifHaveImage" style="height: 10vmax" alt=""/>
                  <img :src="showPhoto" alt="" style="height: 10vmax" />
                </p>
            </el-form-item>
            <el-row :span="24">
              <el-form-item label="讲师名称"  prop="teachername" style="width: 700px">
                <el-input placeholder="请输入讲师名称"  v-model="insertfrom.teachername"></el-input>
              </el-form-item>
            </el-row>
            <el-form-item label="讲师简介" style="width:700px" prop="teacherIntroduction">
              <el-input placeholder="请输入讲师简介" maxlength="200"  type="textarea"  :rows="4" v-model="insertfrom.teacherIntroduction"></el-input>
            </el-form-item>
          </el-form>
          <div class="button">
          <el-button @click="teacherInsertVisible=false;">取消</el-button>
          <el-button type="danger" @click="insertData" >确定</el-button>
          </div>
        </el-dialog>
        <el-table
          v-loading="teacherTableLoading"
          :data="tableData"
          stripe
          style="width: 100%;text-align: center">
          <el-table-column
            prop="teacherdata"
            label="讲师编号"
            width="200"
            align="center">
          </el-table-column>
            <el-table-column
              prop="teachername"
              label="讲师名称"
              width="200"
              align="center">

          </el-table-column>
          <el-table-column
            prop="teacherIntroduction"
            label="讲师简介"
            width="525"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
            align="center">
            <template slot-scope="scope">
              <el-button @click="deleteInit(scope.$index)" type="danger"  round size="small">移除</el-button>
              <el-button type="danger"  @click="open(scope.$index)" round size="small">修改</el-button>
              <el-dialog :visible.sync="teacherEditorVisible" width='900px' >
                <el-form
                  :rules="rules"
                  :model="insertfrom"
                  ref="dataForm"
                  label-position="left"
                  label-width="90px"
                  style="width: 700px; margin-left:50px;">
                  <el-form-item label="讲师图片" style="width:700px;text-align: left"  prop="photoAddress">
                    <input type="file" id="selectImageE" hidden="" @change="filePreview">
                    <p @click="selectImgE()" >
                      <img :src="deafaultImage" v-if="ifHaveImage" style="height: 10vmax" alt=""/>
                      <img :src="showPhoto" alt="" style="height: 10vmax" />
                    </p>
                  </el-form-item>
                  <el-row :span="24">
                    <el-form-item label="讲师名称"  prop="teachername" style="width: 700px">
                      <el-input placeholder="请输入讲师名称" :disabled="checked" v-model="insertfrom.teachername"></el-input>
                    </el-form-item>
                  </el-row>
                  <el-form-item label="讲师简介" style="width:700px" prop="teacherIntroduction">
                    <el-input placeholder="请输入讲师简介" maxlength="200" :disabled="checked" type="textarea"  :rows="4" v-model="insertfrom.teacherIntroduction"></el-input>
                  </el-form-item>
                </el-form>
                <div class="button">
                  <el-button @click="showdisable">编辑</el-button>
                  <el-button type="danger" @click="confirm_upload()">确认修改</el-button>
                </div>
              </el-dialog>
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
      </div>
    </el-main>
  </div>

    <el-dialog :visible.sync="deleteConfirmBox" width="40%">
<!--      <template slot-scope="scope">-->
        <h1>您确定要删除嘛？</h1>
        <div class="button">
          <el-button @click="deleteConfirmBox=false">取消</el-button>
          <el-button type="danger" @click="deleteRow" >确认</el-button>
        </div>
<!--      </template>-->
    </el-dialog>
  </div>
</template>

<script>
import {
  updataTeacherMsg,
  searchTeacher,
  getAllTeachers,
  updataInput,
  insertData,
  deleteTeacher
} from "@/services/AdminInstructorInformation";
import {getAllCourse, searchCourse} from "@/services/AdminManageCourse";
import {cloneObj, getImageBypath, popMsg} from "@/services/Common";

export default {

  data() {
    return {
      deafaultImage: require("../assets/defaultAddUerImage.png"),
      ifHaveImage:true,
      showPhoto:'',
      teacherTableLoading:false,
      checked:true,
      checkInsearch:false,
      teacherInsertVisible :false,
      teacherEditorVisible :false,
      deleteConfirmBox :false,
      currentPage: 1, //初始页
      pagesize: 5,    // 每页的数据
      pageCount:0,
      searchInput:'',
      deleteIndex:-1,//删除要用
      insertfromOld:{
        teacherdata:'',
        teachername:'',
        teacherIntroduction: '',
        photoAddress:''
      },
      insertfrom:{
        teacherdata:'',
        teachername:'',
        teacherIntroduction: '',
        photoAddress:''
      },
      rules: {
        teachername: [
          { required: true, message: '请输入讲师名称', trigger: 'blur' },
           { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
      teacherIntroduction: [
        {required:true,message: '请输入讲师简介', trigger: 'blur'},
        { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
      ]},
      tableData: [{
        teacherdata: '2016-05-02',
        teachername: '小1',
        teacherIntroduction:'语文',
      }]
  }
  },
  methods: {
    //选择图片
    selectImg:function(){
      document.getElementById('selectImage').click()
    },
    selectImgE:function (){
      document.getElementById('selectImageE').click()
    },

    //将头像显示
    filePreview: function (e) {
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
          this.insertfrom.photoAddress = '-1'//表示已经更改
        };
        reader.readAsDataURL(file)
      }
      e = null
    },

    handleClick4() {
      this.$router.push({
        name: 'recommend'
      })
    },

    showdisable() {
      this.checked = false
    },

    deleteInit(index) {
      this.deleteConfirmBox = true
      this.deleteIndex = index
    },

    deleteRow() {
      this.deleteConfirmBox = false
      deleteTeacher(this.tableData[this.deleteIndex].teacherdata).then((res) => {
        if(res)
          this.commonF.popMsg("删除成功",'success')
        else
          this.commonF.popMsg("删除失败",'error')
        this.flushTable()
      })
    },

    // 初始页currentPage、初始每页数据数pagesize和数据data-->
    handleSizeChange: function (size) {
      this.pagesize = size;
      this.currentPage = 1;
      this.flushTable()
    },
    handleCurrentChange: function (currentPage) {
      //console.log(currentPage)
      this.currentPage = currentPage;
      this.flushTable()
    },
    open(index) {
      this.teacherEditorVisible = true
      this.checked = true
      this.flushInsertfrom(this.tableData[index])
      this.$refs["dataForm"] && this.$refs["dataForm"].resetFields();
      // this.$refs["dataForm"].resetFields();
    },

    insert() {
      this.$refs["dataForm1"] && this.$refs["dataForm1"].resetFields();
      this.flushInsertfrom()
      this.teacherInsertVisible = true
    },

    insertData() {//插入讲师
      if(!this.ifHaveImage){
        this.insertfrom.photoAddress = this.showPhoto
      }
      insertData(this.insertfrom).then((res) => {
        if(res){
          this.commonF.popMsg("添加成功",'success')
        }
        else{
          this.commonF.popMsg("添加失败",'error')
        }
        this.teacherInsertVisible = false
        this.flushTable()
      })
    },

    /**
     * 刷新表格
     * 2022年1月12日10:52:26
     * @param data 初始化数据
     */
    flushInsertfrom(data = null) {
      this.insertfrom = updataInput(data)
      this.insertfromOld = cloneObj(this.insertfrom)
      if(this.insertfrom.photoAddress!==''){
        getImageBypath(this.insertfrom.photoAddress).then((res)=>{
          this.showPhoto = res
          this.ifHaveImage = false
        })
      }
      else{
        this.ifHaveImage = true //2022年1月16日22:23:48
        this.showPhoto = ''
      }
    },

    confirm_upload() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if(!this.ifHaveImage&&this.insertfrom.photoAddress!==this.insertfromOld.photoAddress){
            this.insertfrom.photoAddress = this.showPhoto
          }
          updataTeacherMsg(this.insertfrom, this.insertfromOld).then((res) => {
            if(res)
              this.commonF.popMsg("修改成功",'success')
            else
              this.commonF.popMsg("修改失败",'error')
            this.flushInsertfrom()
            this.flushTable()
            this.teacherEditorVisible = false
          })
        } else {
          this.commonF.popMsg("错误提交!",'error')
          return false;
        }
      });
    },

    searchTeacherButton() {
      this.checkInsearch = this.searchInput !== '';
      this.flushTable()
    },

    //分页刷新 2022年1月10日22:42:13
    async flushTable() {
      this.teacherTableLoading = true
      var res = null
      if (this.checkInsearch) {
        this.currentPage = 1
        res = await searchTeacher(this.searchInput, this.currentPage, this.pagesize)
      } else {
        res = await getAllTeachers(this.currentPage, this.pagesize)
      }
      this.tableData = res.teacherList
      this.pageCount = res.pageCount
      this.teacherTableLoading = false
      this.$forceUpdate()
    },
  },
  created() {
    this.flushTable()
  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
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
