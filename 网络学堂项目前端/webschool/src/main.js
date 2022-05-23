// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
//import 'element-ui/lib/theme-chalk/index.css'
import './theme/elementui/index.css'
import VideoPlayer from 'vue-video-player'
import visibility from 'vue-visibility-change';
import 'video.js/dist/video-js.css'
import axios from "axios"
import store from  './store'
import mainFunction from './services/VueMainFunction'
import 'default-passive-events'
Vue.use(VideoPlayer);
Vue.use(visibility);
Vue.prototype.commonF = mainFunction

Vue.config.productionTip = false;
require('vue-video-player/src/custom-theme.css')
Vue.config.productionTip = false
axios.defaults.baseURL = '/api';

Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
// template: '<App/>', 不修改不能运行
  render: h => h(App)
}).$mount("#app")
