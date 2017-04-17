<template>
  <div class="search-bar" :style="{zIndex: zIndex}">
    <button type="button" name="button" class="searchbar__btn" @click="showSidebar">
      <img :src="rightBtnSrc" alt="">
    </button>
    <label for="" v-if="!isEntering" class="searchbar__label searchbar__info" @click="changeLocation">Your Current Location</label>
    <gmap-autocomplete @place_changed="setPlace" class="searchbar__input searchbar__info" ref="input" @click.native="" v-else>
    </gmap-autocomplete>

    <button type="button" name="button" class="searchbar__btn" @click="clearInput">
      <img src="../assets/img/close.png" alt="">
    </button>
  </div>
</template>

<script>
import Vue from 'vue'
import VueLocalStorage from 'vue-localstorage'

Vue.use(VueLocalStorage)

const menuImg = require('../assets/img/menu.png')
const backImg = require('../assets/img/back.png')
const centerMarkerImg = require('../assets/img/center-marker.png')

export default {
  data(){
    return{
      latLng: {},
      rightBtnSrc: menuImg,
      isEntering: false,
      zIndex: 0
    }
  },
  methods:{
    changeLocation(){
      this.isEntering = true
    },
    showSidebar(){
      if(!this.isEntering){
        this.$parent.showMask = true
        this.$emit('on-close')
      }else{
        this.isEntering = false
      }
    },
    clearInput(){
      if(this.isEntering){
        this.$refs.input.$el.value = ''
      }else{
        this.isEntering = true
      }
    },
    setPlace(place){
      this.isEntering = false
      this.latLng = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
      this.$parent.center = this.latLng
      var userLocation = {
        position: this.latLng,
        icon: centerMarkerImg,
        clickable: false,
        title: "user"
      }
      var markers = this.$parent.markers
      if(markers[markers.length - 1].title === "user"){
        markers.splice(-1,1)
      }
      markers.push(userLocation)
      this.$localStorage.set('userLocation', this.latLng)
    }
  },
  watch: {
    isEntering(val){
      if(val){
        this.rightBtnSrc = backImg
        this.$parent.showMask = true
        this.zIndex = 9
      }else{
        this.rightBtnSrc = menuImg
        this.$parent.showMask = false
        this.zIndex = 0
      }
    }
  }
}
</script>

<style>
  .pac-container{
    margin-top: 10px;
  }
  .search-bar{
    width: 88%;
    height: 44px;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    display: flex;
  }
  .searchbar__info{
    width: calc(100% - 88px);
    height: 44px;
    font-size: 14px;
    padding: 0 10px;
  }
  .searchbar__label{
    line-height: 44px;
  }
  .searchbar__input{
    color: #9b9b9b;
  }
  .searchbar__btn{
    width: 44px;
    height: 44px;
  }
</style>
