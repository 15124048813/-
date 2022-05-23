<template>
  <el-container>
    <el-header style="height: 150px">
        <img src="../assets/ProgramLogo.png" style="width: 550px"/>
    </el-header>
    <el-main >
      <div style="margin-top: 50px">
        <el-divider content-position="center"><span style="font-size: 30px">&nbsp;&nbsp;&nbsp;&nbsp;密码找回&nbsp;&nbsp;&nbsp;&nbsp;</span></el-divider>
      </div>

      <div style="margin-top: 50px;">
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="手机号验证"></el-step>
          <el-step title="重设密码"></el-step>
          <el-step title="设置成功"></el-step>
        </el-steps>


      </div>


      <div class="frame" v-show="active === 1">
        <div style="margin-left: 10%">
          <span>手机号：</span>
          <el-input placeholder="请输入手机号" v-model="phoneNumber" class="input-with-select" style="width: 67%;margin-top: 50px">
            <el-select v-model="select" slot="prepend" placeholder="中国大陆" style="width: 150px">
              <el-option label="中国大陆" value="1"></el-option>
              <el-option label="中国香港特区" value="2"></el-option>
              <el-option label="中国澳门特区" value="3"></el-option>
              <el-option label="中国台湾" value="4"></el-option>
            </el-select>
          </el-input>
        </div>


        <!-- 验证码 (文本框) -->
        <div style="margin-top: 35px;margin-left: 10%;">
          <el-input placeholder="请输入验证码" v-model="VerificationCode" style="width: 80%">
            <template slot="append"><el-button>获取验证码</el-button></template>
          </el-input>
        </div>


        <!-- 下一步按钮 (矩形) -->
        <el-button style="margin-top: 50px;margin-left: 43%;margin-bottom: 50px" v-on:click="next">下一步</el-button>
      </div>

      <div class="frame" v-show="active === 2">
        <!--<div style="margin-left: 10%">-->
          <!--<span>新密码：</span>-->
          <!--<el-input placeholder="请输入" v-model="NewPassword" class="input" style="width: 70%;margin-top: 50px">-->
          <!--</el-input>-->
        <!--</div>-->


        <!--&lt;!&ndash; 验证码 (文本框) &ndash;&gt;-->
        <!--<div style="margin-left: 10%">-->
          <!--<span>确认密码：</span>-->
          <!--<el-input placeholder="请输入" v-model="NotifyPassword" class="input" style="width: 67%;margin-top: 50px">-->
          <!--</el-input>-->
        <!--</div>-->


        <!--&lt;!&ndash; 下一步按钮 (矩形) &ndash;&gt;-->
        <!--<el-button style="margin-top: 50px;margin-left: 43%;margin-bottom: 50px" v-on:click="checkPassword">下一步</el-button>-->
        <br>
        <br>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="密码" prop="pass" >
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off" style="width: 80%;"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" style="width: 80%"></el-input>
          </el-form-item>

          <el-form-item style="margin-top: 50px;margin-left: 50px">
            <el-button type="primary" @click="submitForm('ruleForm')" style="margin-right: 100px">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <br/>
        <br/>
      </div>

      <div class="frame" v-show="active === 3">
        <br>
        <br>
        <div style="text-align: center;vertical-align: center;margin-top: 25px">
          <span style="font-size: 25px">重设密码成功</span>
        </div>



        <!-- 下一步按钮 (矩形) -->
        <el-button style="margin-top: 80px;margin-left: 36%;margin-bottom: 50px" v-on:click="returnLogging" type="danger">确认并返回登录界面</el-button>
      </div>
    </el-main>
  </el-container>

</template>

<script>
    export default {
      name: "RetrievePassword",
      data: function () {
        const validatePass = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入密码'));
          } else {
            if (this.ruleForm.checkPass !== '') {
              this.$refs.ruleForm.validateField('checkPass');
            }
            callback();
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
        return {
          ruleForm: {
            pass: '',
            checkPass: '',
          },
          rules: {
            pass: [
              {validator: validatePass, trigger: 'blur'}
            ],
            checkPass: [
              {validator: validatePass2, trigger: 'blur'}
            ],
          },
          select: '',
          phoneNumber: '',
          active: 1,
          VerificationCode: '',
          // NotifyPassword:'',
          // NewPassword:'',
        }
      },
      methods: {
        submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.active++;
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        next(){
          if (this.VerificationCode === '123456') this.active++;
        },
        // checkPassword(){
        //   if(this.NewPassword === this.NotifyPassword) this.active++
        // },
        returnLogging(){
          this.$router.go(-1);
        }
      }

    }
</script>

<style scoped>
 .el-header{
   background: url("../assets/FindBackPassworfImg.jpg")no-repeat;
   background-size: cover;
 }

  .frame{
    background-color: cornsilk;
    margin-top: 20px;
    margin-left: 30%;
    width: 40%
  }

</style>
