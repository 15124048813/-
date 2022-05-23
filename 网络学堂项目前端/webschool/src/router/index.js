import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import recommend from '@/components/CourseRecommend'
import result from '@/components/SearchCourseResult'
import PersonCenter from '@/user/PersonCenter'
import Administrator from '@/admin/Administrator'
import Logging from '@/components/Logging'
import CourseDetails from '@/components/CourseDetails'
import RetrievePassword from '@/components/RetrievePassword'
import PlayVideo from  '@/components/PlayVideo'
import store from '../store'

import {inspectUserToken, inspectAdminToken,} from '@/services/Login'

Vue.use(Router);


// const originalReplace = Router.prototype.replace;
// Router.prototype.replace = function replace(location) {
//   return originalReplace.call(this, location).catch(err => err);
// };
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// };

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

const router= new Router({
  routes: [
    {
      path:'/',
      redirect:'/Logging'
    },
    {
      path:'/CourseDetails',
      name:'CourseDetails',
      component:CourseDetails
    },
    {
      path:'/Logging',
      name:'Logging',
      component:Logging
    },
    {
      path:'/PlayVideo',
      name:'PlayVideo',
      component:PlayVideo
    },
    {
      path:'/RetrievePassword',
      name:'RetrievePassword',
      component:RetrievePassword
    },
    {
      path: '/HomePage',
      name: 'HomePage',
      component: HomePage,
      children:[{
        path:'/HomePage',
        name:'recommend',
        component: recommend
      },
        {
          path:'/result',
          name:'result',
          component:result
        },
        ]
    },
    {
      path: '/Administrator',
      name: 'Administrator',
      component: Administrator,
      beforeEnter:(to,from,next)=>{
        if(store.state.radio === '2') next();
        else next(false);
      }
    },
    {
      path:'/PersonCenter',
      name:'PersonCenter',
      component:PersonCenter,
      beforeEnter:(to,from,next)=>{
        if(store.state.radio === '1') next();
        else next(false);
      }
    },
  ]
})


export default router

router.beforeEach((to, from, next) => {
  // console.log(store.state.tokenValue);
  if(to.path === '/RetrievePassword' || to.path === '/Logging' ){
    // sessionStorage.clear();
    // console.log(sessionStorage.getItem('tokenValue'));
    store.dispatch('clearAction');
    next()
  }
  else {
    var token = sessionStorage.getItem('tokenValue');
    if(token === '' || token === null){
      next('/Logging');
    }
    else{
      if(store.state.radio === '1'){
        inspectUserToken().then((res)=>{
          if(res){
            next();
          }
          else {
            store.dispatch('clearAction');
            next('/Logging')
          }
        });
      }
      else if(store.state.radio === '2') {
        inspectAdminToken().then((res) => {
          if (res) {
            next();
          }
          else {
            store.dispatch('clearAction');
            next('/Logging')
          }
        });
      }
    }
  }
  // next();
});
