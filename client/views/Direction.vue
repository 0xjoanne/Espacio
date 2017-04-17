<template>
  <div class="direction">
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
        :clickable="false"
        :icon="marker.icon"
        :label="marker.label"
        cursor="pointer"
      ></gmap-marker>
    </gmap-map>

    <action-btns :is-show="false"></action-btns>

    <button type="button" name="button" class="back-btn position-absolute" @click="getDetails"></button>

  </div>
</template>

<script>
import ActionBtns from 'components/ActionBtns'
import VueLocalStorage from 'vue-localstorage'
import Vue from 'vue'

Vue.use(VueLocalStorage)

const activeMarkerImg = require('../assets/img/active-marker.png')
const inactiveMarkerImg = require('../assets/img/inactive-marker.png')
const centerMarkerImg = require('../assets/img/center-marker.png')

export default {
  components: {
    ActionBtns
  },
  data(){
    return{
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
      latLng: {}
    }
  },
  methods:{
    getDetails(){
      this.$router.push('/detail?lat=' + this.latLng.lat + '&lng=' + this.latLng.lng)
    },
    getDirection(){
      var directionsService = new google.maps.DirectionsService
      var directionsDisplay = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#21D331"
        }
      })
      directionsDisplay.setMap(this.$refs.map.$mapObject)
      let currentLocation = this.$localStorage.get('userLocation')
      if(typeof currentLocation !== 'object'){
        currentLocation = JSON.parse(currentLocation)
      }
      var start = new google.maps.LatLng(currentLocation.lat, currentLocation.lng)
      var end = new google.maps.LatLng(this.latLng.lat, this.latLng.lng)
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
    createMarkers(){
      // get coords from $route
      var query = this.$route.query
      this.latLng = {
        lat: Number(query.lat),
        lng: Number(query.lng)
      }

      // create user location marker
      let currentLocation = this.$localStorage.get('userLocation')
      if(typeof currentLocation !== 'object'){
        currentLocation = JSON.parse(currentLocation)
      }
      var userLocationMarker = {
        position: {
          lat: currentLocation.lat,
          lng: currentLocation.lng
        },
        icon: centerMarkerImg,
        clickable: false,
        title: "user"
      }

      //create parking marker
      var parkingMarker ={
        position: {lat: this.latLng.lat, lng: this.latLng.lng},
        icon: activeMarkerImg,
        label: {
          text: '0',
          color: "white",
          fontWeight: "700",
          fontSize: "24px",
          fontFamily: "arial"
        },
        title: "parking"
      }
      this.markers.push(userLocationMarker)
      this.markers.push(parkingMarker)
    }
  },
  watch:{
    parkingLeft(val){
      if(this.$refs.map.$children[1].$markerObject){
        var marker = this.$refs.map.$children[1].$markerObject
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
    // get direction with google direction service
    const _this = this
    this.checkGoogle = setInterval(function () {
      if (window.google) {
        clearInterval(_this.checkGoogle)
        _this.getDirection()
      }
    }, 10)
  }
}
</script>

<style>
</style>
