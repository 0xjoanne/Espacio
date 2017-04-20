<template>
  <div class="action__btns position-absolute">
    <button type="button" name="button" class="zoom-btn zoom-in" @click="zoomin">
      <img :src="zoominSrc" alt="">
    </button>
    <button type="button" name="button" class="zoom-btn zoom-out" @click="zoomout">
      <img :src="zoomoutSrc" alt="">
    </button>
    <button type="button" name="button" class="target-btn" @click="getUserLocation">
      <img src="../assets/img/target.png" alt="">
    </button>
  </div>
</template>

<script>
const zoominImg = require('../assets/img/zoomin.png')
const zoominHoverImg = require('../assets/img/zoomin-hover.png')
const zoomoutImg = require('../assets/img/zoomout.png')
const zoomoutHoverImg = require('../assets/img/zoomout-hover.png')
const centerMarkerImg = require('../assets/img/center-marker.png')

export default {
  data(){
    return{
      zoominSrc: zoominImg,
      zoomoutSrc: zoomoutImg
    }
  },
  methods:{
    zoomin(){
      console.log(this.$parent.zoomValue)
      if(this.$parent.zoomValue < 20){
        ++this.$parent.zoomValue
      }
      this.changeZoomImg()
    },
    zoomout(){
      if(this.$parent.zoomValue){
        --this.$parent.zoomValue
      }
      this.changeZoomImg()
    },
    changeZoomImg(){
      var val = this.$parent.zoomValue
      if(val > 19){
        this.zoominSrc = zoominHoverImg
      }else if(val < 1){
        this.zoomoutSrc = zoomoutHoverImg
      }else{
        this.zoominSrc = zoominImg
        this.zoomoutSrc = zoomoutImg
      }
    },
    getUserLocation(){
      this.$emit('get-user-location')
    }
  }
}
</script>

<style>
  .action__btns{
    right: 20px;
    bottom: 35px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .zoom-btn{
    width: 54px;
    height: 54px;
  }
  .target-btn{
    width: 70px;
    height: 70px;
  }
</style>
