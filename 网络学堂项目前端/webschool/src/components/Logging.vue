<template>
  <div class="body">


    <!-- logo (图片 ) -->
    <!--<el-image :src="logo"></el-image>-->
    <img :src="logo" width="643"/>


    <!-- Unnamed (矩形) -->
    <div class="logging">
      <h1>登录</h1>
      <!-- 账号栏 (文本框) -->
      <div class="InputLine" data-label="账号栏">
        <el-input v-model="userForm.account" placeholder="请输入账号"><template slot="prepend">账号：</template></el-input>
      </div>

      <div class="InputLine" data-label="密码栏">
        <form>
          <el-input v-model="userForm.password" show-password placeholder="请输入密码" @keyup.native.enter="goToIndex"><template slot="prepend">密码：</template></el-input>
        </form>

      </div>

      <div class="Identity">
        <el-radio v-model="radio" label="1" style="margin-left: 30px;" status="exception" ><span style="font-size: 20px">以用户登录</span></el-radio>
        <el-radio v-model="radio" label="2" style="margin-left: 60px;" status="exception"><span style="font-size: 20px">管理员登录</span></el-radio>
      </div>
      <button class="FindPassword" v-on:click="goToRetrievePassword">忘记密码？点击这里</button>

      <el-button type="danger" style="width: 80%;margin-left: 10%;margin-top: 20px" v-on:click="goToIndex">登录</el-button>
    </div>



  </div>
</template>

<script>
  // import axios from "axios";
  import {userLogin, adminLogin} from '@/services/Login'

    export default {
        name: "Logging",
        data(){
          return{
            logo:require('../assets/ProgramLogo.png'),
            userForm:{
              password:'',
              account:'',
            },
            radio:'1',
            userPassword:'1234',
            administratorPassword: '5678',
            correction:false,
          }
        },
        methods:{
          goToRetrievePassword(){
            this.$router.push({path:'/RetrievePassword'})
          },
          goToIndex(){
            const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              // background: 'rgba(0, 0, 0, 0.7)'
            });
            // this.$router.push({name:'recommend'});
            const account = this.userForm.account;
            const password = this.userForm.password;
            if(this.radio === '1'){
              userLogin(account,password).then(res =>{
                if(res.code === 200){
                  loading.close();
                  this.$store.dispatch('radioAction',this.radio);
                  this.$store.dispatch('loginAction',res.data);
                  this.loggingSuccess();
                  setTimeout(() =>{
                    this.$router.push({name:'recommend'});
                  },1000);
                }
                else if (res.code === 500){
                  loading.close();
                  this.loggingError();
                }
                else if(res.code === 900910){
                  loading.close();
                  this.$message({
                    message: '用户不存在',
                    type: 'error',
                    duration: 1000,
                  });
                }
              });
            }
            else if(this.radio === '2'){
              adminLogin(account,password).then(res =>{
                // this.userForm.account = res.code;
                if(res.code === 200){
                  loading.close();
                  this.$store.dispatch('radioAction',this.radio);
                  this.$store.dispatch('loginAction',res.data);
                  // console.log(res);
                  this.loggingSuccess();
                  setTimeout(() =>{
                    this.$router.push({path:'/Administrator'},);
                  },1000);
                }
                else if (res.code === 500){
                  loading.close();
                  this.loggingError();
                }
                else if(res.code === 900910){
                  loading.close();
                  this.$message({
                    message: '用户不存在',
                    type: 'error',
                    duration: 1000,
                  });
                }
              });
            }
          },
          loggingSuccess() {// 登陆成功提示框
            this.$message({
              message: '登录成功!',
              type: 'success',
              duration: 1000,
            });
          },
          loggingError() {// 登陆异常提示框
            this.$message({
              message: '账号或密码不正确',
              type: 'error',
              duration: 1000,
            });
          },
        },
    }
</script>

<style scoped>
  h1{
    margin-top: 40px;
    font-size: xx-large;
    text-align: center;
    color: #D9001B;
  }
  .InputLine{
    width: 80%;
    margin-top: 40px;
    margin-left: 10%;
  }
  .Identity{
    margin-left: 10%;
    margin-top: 40px;
  }
  .body{
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-image: url("../assets/LoggingBackground.jpg");
    background-size: 100% 100%;
  }

  .logging{
    position: absolute;
    height: 500px;
    width: 500px;
    top: 150px;
    right: 150px;
    background-color: rgba(248,248,255,0.95);
    border-radius: 20px;
  }

  .FindPassword{
    border:none;
    color: #000;
    margin-top:20px;
    margin-left: 60%;
    font-size: 20px;
    background: transparent;
  }

  .FindPassword:hover{
    color: brown;
    cursor:pointer
  }




</style>
