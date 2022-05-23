<template>
  <div id="app">

    <router-view/>
  </div>
</template>

<script>
import Canvas from './utils/canvas-nest.js'

export default {
  name: 'App',
  components: {
    Canvas
  }
}
</script>

<style>

canvas{
  background: rgb(226, 225, 225);
  opacity: 0.3;
}

* {
  margin: 0;
  padding: 0;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
/* 滚动条的滑块 */
::-webkit-scrollbar-thumb {
  background-color: #a1a3a9;
  border-radius: 3px;
}

</style>
