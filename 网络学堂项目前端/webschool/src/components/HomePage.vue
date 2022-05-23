<template>
  <div>
    <Head></Head>
    <!--底部（推荐视频与搜索结果）-->
    <br>
    <router-view></router-view>

  </div>
</template>


<script>
  import Head from './PageHead'
export default {
  name: 'HomePage',
  components:{
    Head,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
