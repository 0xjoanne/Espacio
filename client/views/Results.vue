<template>
  <div class="result">
    <gmap-map
      :center="center"
      :zoom="zoomValue"
      :options="{ styles: styles, disableDefaultUI: true}"
      :style="{width: mapWidth, height: mapHeight}"
      ref="map"
    >
      <gmap-marker
        v-for="(marker,index) in markers"
        :key="index"
        :position="marker.position"
        :draggable="false"
        @click="showDetails(index, marker)"
        :icon="marker.icon"
        :label="marker.label"
        cursor="pointer"
      ></gmap-marker>
    </gmap-map>

    <div v-if="isDetailMode">
      <detail></detail>

      <button type="button" name="button" class="direction-btn position-absolute" @click="getDirection"></button>
    </div>

    <action-btns @get-user-location="getUserLocation" v-else></action-btns>

    <search-bar class="position-absolute" @on-close="onClose" ref="searchbar" v-if="isResultMode"></search-bar>

    <button type="button" name="button" class="back-btn position-absolute" @click="backToPrev" v-show="!isResultMode"></button>

    <div class="mask position-absolute" v-show="showMask" @click="toggleMask"></div>

    <sidebar v-model="showSidebar"></sidebar>

  </div>
</template>

<script>
import SearchBar from 'components/SearchBar'
import Sidebar from 'components/Sidebar'
import ActionBtns from 'components/ActionBtns'
import Detail from 'components/Detail'
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
        lat: 43.647248,
        lng: -79.403388
      }
    }
  },
  components: {
    SearchBar,
    Sidebar,
    ActionBtns,
    Detail
  },
  data(){
    return {
      mapWidth: "100vw",
      mapHeight: "100vh",
      zoomValue: 15,
      showSidebar: false,
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
      center: {lat: 43.647248, lng: -79.403388},
      markers: [{
        position: {lat: 43.649266, lng: -79.400320},
        icon: activeMarkerImg,
        label: {
          text: '24',
          color: "white",
          fontWeight: "700",
          fontSize: "24px",
          fontFamily: "arial"
        },
        title: "parking"
      },{
        position: {lat: 43.652898, lng: -79.396678},
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
        position: {lat: 43.642682, lng: -79.399204},
        icon: inactiveMarkerImg,
        title: "parking"
      }],
      showMask: false,
      latLng: {},
      isDetailMode: false,
      isResultMode: true
    }
  },
  methods:{
    onClose () {
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
    showDetails(index, marker){
      this.mapHeight = "35vh"
      this.$refs.map.resize()
      this.isDetailMode = true
      this.isResultMode = false
      this.center = {
        lat: marker.position.lat,
        lng: marker.position.lng
      }
    },
    backToPrev(){
      if(this.isDetailMode){
        this.mapHeight = "100vh"
        this.isDetailMode = false
        this.isResultMode = true
        let currentLocation = this.$localStorage.get('userLocation')
        this.center = {
          lat: currentLocation.lat,
          lng: currentLocation.lng
        }
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
      this.center = this.latLng
      this.$localStorage.set('userLocation', this.latLng)
      this.addNewMarker(this.latLng)
    },
    getDirection(start, end){
      var directionsService = new google.maps.DirectionsService
      var directionsDisplay = new google.maps.DirectionsRenderer
      directionsDisplay.setMap(this.$refs.map.$mapObject)
      directionsService.route({
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
      }, function(response, status) {
        if (status === 'OK') {
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      })
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
    updateUserMarker(){
      let currentLocation = this.$localStorage.get('userLocation')
      this.center = currentLocation
      this.addNewMarker(currentLocation)
    }
  },
  mounted(){
    var query = this.$route.query.action
    if(query === "getUserLocation") {
      this.getUserLocation()
    }else if(query === "enterLocation"){
      this.$refs.searchbar.isEntering = true
    }else if(query === "getDirection"){
      const _this = this
      this.checkGoogle = setInterval(function () {
        if (window.google) {
          clearInterval(_this.checkGoogle)
          var start = new google.maps.LatLng(43.647248, -79.403388);
          var end = new google.maps.LatLng(43.652898, -79.396678);
          _this.getDirection(start, end)
        }
      }, 10)

      this.updateUserMarker()
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
  .vue-map-container{
    transition: all 0.5s;
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


  /* autocomplete dropdown */
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
