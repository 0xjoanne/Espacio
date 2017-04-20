<template>
  <div class="search-bar" :style="{zIndex: zIndex}">

    <button type="button" name="button" class="searchbar__btn" @click="existEntering" v-if="isEntering">
      <img src="../assets/img/back.png" alt="">
    </button>

    <button type="button" name="button" class="searchbar__btn " @click="showSidebar" v-else>
      <img src="../assets/img/menu.png" alt="">
    </button>

    <gmap-autocomplete @place_changed="setPlace" class="searchbar__input searchbar__info" ref="input" @click.native="changeInput" @keyup.native="keyupInput">
    </gmap-autocomplete>

    <!-- show when type -->
    <button type="button" name="button" class="searchbar__btn" @click="clearInput" v-show="isShowClearBtn" title="clear search">
      <img src="../assets/img/close.png" alt="">
    </button>
  </div>
</template>

<script>
import Vue from 'vue'
import VueLocalStorage from 'vue-localstorage'

Vue.use(VueLocalStorage)

const centerMarkerImg = require('../assets/img/center-marker.png')
const destinationMarkerImg = require('../assets/img/destination-marker.png')

export default {
  props:{
    labelContent:{
      type: String,
      default: "Your Current Location"
    }
  },
  data(){
    return{
      latLng: {},
      isEntering: false,
      zIndex: 0,
      isShowClearBtn: false,
      destinationAddress: null
    }
  },
  methods:{
    showSidebar(){
      if(!this.isEntering){
        this.$parent.showMask = true
        this.$emit('on-close')
      }else{
        this.isEntering = false
      }
    },
    existEntering(){
      this.isEntering = false
      this.$refs.input.$el.value = this.destinationAddress
    },
    clearInput(){
      this.$refs.input.$el.value = ''
      this.isShowClearBtn = false
      this.isEntering = true
    },
    changeInput(){
      if(this.$refs.input.$el.value === ''){
        this.isShowClearBtn = false
      }else{
        this.isShowClearBtn = true
      }
      this.isEntering = true
    },
    keyupInput(){
      if(this.$refs.input.$el.value !== ''){
        this.isShowClearBtn = true
      }else{
        this.isShowClearBtn = false
      }
    },
    placeCursor(){
      var val = this.$refs.input.$el.value
      this.$refs.input.$el.value = ""
      this.$refs.input.$el.value = val
    },
    setPlace(place){
      this.destinationAddress = this.$refs.input.$el.value
      this.isEntering = false
      this.latLng = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
      this.$parent.center = this.latLng
      this.$emit('update-searchbar-label', this.latLng)
      var destination = {
        position: this.latLng,
        icon: destinationMarkerImg,
        clickable: false,
        title: "destination"
      }
      var markers = this.$parent.markers
      if(markers[markers.length - 1].title === "destination"){
        markers.splice(-1,1)
      }
      markers.push(destination)
      this.$localStorage.set('destination', this.latLng)

    }
  },
  watch: {
    isEntering(val){
      if(val){
        this.$parent.showMask = true
        this.zIndex = 9
      }else{
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
    width: calc(100% - 98px);
    height: 42px;
    font-size: 14px;
    padding: 0 5px;
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
    display: block;
  }
</style>
