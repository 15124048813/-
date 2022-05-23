import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const sessionStore = window.sessionStorage;

export default new Vuex.Store({
  state: {
    radio: sessionStore.getItem("radio") ? JSON.parse(sessionStore.getItem("radio")) : '0',  //判断用户类型
    accountNumber:sessionStore.getItem("accountNumber") ? JSON.parse(sessionStore.getItem("accountNumber")) : '',  //目前根据用户账号拿用户信息
    tokenValue:sessionStore.getItem("tokenValue") ? sessionStore.getItem("tokenValue") : '',  //用户token保存
    userId:sessionStore.getItem("userId") ? JSON.parse(sessionStore.getItem("userId")) : -1,  //用户id保存
  },
  mutations: {
    // setSearchCourseText(state,text){
    //   sessionStore.setItem('searchCourseText',text);
    // },
    setRadio(state,val){
      state.radio = val;
      sessionStore.setItem('radio',JSON.stringify(val))
    },
    login(state,res){
      sessionStore.setItem('tokenValue',res.token);
      state.tokenValue = res.token;
      sessionStore.setItem('userId',JSON.stringify(res.id));
      state.userId = res.id;
    },
    clear(state){
      state.radio = '0';
      state.userId = -1;
      state.tokenValue = '';
      sessionStore.clear()
    },
  },
  actions: {
    radioAction(context,val){
      context.commit('setRadio',val);
    },
    // searchAction(context,text){
    //   context.commit('setSearchCourseText',text);
    // },
    clearAction(context){
      context.commit('clear')
    },
    loginAction(context,res){
      context.commit('login',res)
    },

  }
});
