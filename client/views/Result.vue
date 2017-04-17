<template>
  <div class="result">
    <gmap-map
      :center="center"
      :zoom="zoomValue"
      :options="{ styles: styles, disableDefaultUI: true}"
      style="width: 100vw; height: 100vh"
      ref="map"
    >
      <gmap-marker
        v-for="(marker,index) in markers"
        :key="index"
        :position="marker.position"
        :draggable="false"
        @click="showDetail(index, marker)"
        :icon="marker.icon"
        :label="marker.label"
        cursor="pointer"
      ></gmap-marker>
    </gmap-map>

    <action-btns @get-user-location="getUserLocation" :is-show="true"></action-btns>

    <search-bar class="position-absolute" @on-close="onClose" ref="searchbar" :label-content="userAddress" @update-searchbar-label="updateSearchbarLabel"></search-bar>

    <div class="mask position-absolute" v-show="showMask" @click="toggleMask"></div>

    <sidebar v-model="showSidebar"></sidebar>

  </div>
</template>

<script>
import SearchBar from 'components/SearchBar'
import Sidebar from 'components/Sidebar'
import ActionBtns from 'components/ActionBtns'
import * as VueGoogleMaps from 'vue2-google-maps'
import Vue from 'vue'
import VueLocalStorage from 'vue-localstorage'

Vue.use(VueLocalStorage)

const activeMarkerImg = require('../assets/img/active-marker.png')
const inactiveMarkerImg = require('../assets/img/inactive-marker.png')
const centerMarkerImg = require('../assets/img/center-marker.png')

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDqIC1rYmAPrIFu1NOOvW7Fa8lFiBY0HEY',
    v: '3.27',
    libraries: 'places'
  }
});

export default {
  localStorage:{
    userLocation: {
      type: Object,
      default: {
        lat: 43.729159,
        lng: -79.606545
      }
    }
  },
  components: {
    SearchBar,
    Sidebar,
    ActionBtns
  },
  data(){
    return {
      zoomValue: 15,
      styles:[
        {"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},
        {"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},
        {"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},
        {"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},
        {"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},
        {"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},
        {"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},
        {"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},
        {"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},
        {"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},
        {"elementType":"labels.icon","stylers":[{"visibility":"off"}]},
        {"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},
        {"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},
        {"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}],
      center: {lat: 43.729159, lng: -79.606545},
      markers: [],
      showSidebar: false,
      showMask: false,
      latLng: {},
      userAddress: "Your Current Location"
    }
  },
  methods:{
    createMarkers(){
      this.markers = [{
        position: {lat: 43.732554, lng: -79.611481},
        icon: inactiveMarkerImg,
        label: {
          text: ' ',
          color: "white",
          fontWeight: "700",
          fontSize: "24px",
          fontFamily: "arial"
        },
        title: "parking"
      },{
        position: {lat: 43.730724, lng: -79.598520},
        icon: {
          url: activeMarkerImg
        },
        label: {
          text: '10',
          color: "white",
          fontWeight: "700",
          fontSize: "24px",
          fontFamily: "arial"
        },
        title: "parking"
      },{
        position: {lat: 43.720916, lng: -79.599413},
        icon: inactiveMarkerImg,
        title: "parking"
      }]
    },
    onClose(){
      this.showSidebar = !this.showSidebar
    },
    toggleMask(){
      if(this.showSidebar){
        this.showSidebar = false
      }else{
        this.$refs.searchbar.isEntering = false
      }
      this.showMask = false
    },
    showDetail(index, marker){
      var lastIndex = this.markers.length - 1
      if(index !== lastIndex){
        var lat = marker.position.lat
        var lng = marker.position.lng
        this.$router.push('/detail?lat=' + lat + '&lng=' + lng)
      }
    },
    getUserLocation(){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition)
      }else{
        console.log("not supported")
      }
    },
    showPosition(position){
      this.latLng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      this.updateSearchbarLabel(this.latLng)
      this.center = this.latLng
      this.$localStorage.set('userLocation', this.latLng)
      this.addNewMarker(this.latLng)
    },
    updateUserMarker(){
      let currentLocation = this.$localStorage.get('userLocation')
      this.center = currentLocation
      this.addNewMarker(currentLocation)
    },
    addNewMarker(currentLocation){
      var userLocationMarker = {
        position: currentLocation,
        icon: centerMarkerImg,
        clickable: false,
        title: "user"
      }
      if(this.markers[this.markers.length - 1].title === "user"){
        this.markers.splice(-1,1)
      }
      this.markers.push(userLocationMarker)
    },
    updateSearchbarLabel(coords){
      var geocoder = new google.maps.Geocoder
      var self = this
      geocoder.geocode({'location': coords}, function(results, status) {
        if (status === 'OK') {
          if (results[1]) {
            self.userAddress = results[1].address_components[0].long_name
          } else {
            self.userAddress = "Your Current Location"
          }
        } else {
          self.userAddress = "Your Current Location"
        }
      })
    }
  },
  watch:{
    parkingLeft(val){
      if(this.$refs.map.$children[0].$markerObject){
        var marker = this.$refs.map.$children[0].$markerObject
        var label = marker.getLabel()
        if(val === 0){
          marker.icon = inactiveMarkerImg
          label.text = ' '
        }else{
          marker.icon = activeMarkerImg
          label.text = val+''
        }
        marker.setLabel(label)
      }
    }
  },
  computed:{
    parkingLeft(){
      if(this.$store.state.parkingMock){
        return this.$store.state.parkingMock.left
      }
    }
  },
  created(){
    this.createMarkers()
  },
  mounted(){
    var query = this.$route.query.action
    if(query === "getUserLocation") {
      this.getUserLocation()
    }else if(query === "enterLocation"){
      this.$refs.searchbar.isEntering = true
    }else{
      this.updateUserMarker()
    }
  }
}
</script>

<style>
  .result{
    position: relative;
  }
  .search-bar{
    top: 35px;
    left: 20px;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
  }
  .mask{
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
  }
  .action__btns{
    right: 25px;
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
  .pac-container{
    width: 88% !important;
    margin-left: auto;
    margin-right: auto;
    left: 0 !important;
    right: 0 !important;
  }
  .hdpi .pac-icon{
    background: url('../assets/img/pac-icon.png') no-repeat center center;
    width: 20px;
    height: 23px;
    margin: 14px;
  }
  .pac-item{
    height: 50px;
    line-height: 50px;
    font-size: 12px;
    border-top-color: #fcfcfc;
  }
  .pac-item-query{
    font-size: 14px;
  }
  .hdpi.pac-logo:after{
    background-image: none;
    height: 0;
  }

</style>
