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

    <action-btns @get-user-location="getUserLocation"></action-btns>

    <button type="button" name="button" class="back-btn position-absolute" @click="getDetails">
      <img src="../assets/img/back.png" alt="">
    </button>

    <div class="direction__bar direction__start-point position-absolute" :style="{zIndex: zIndex}">
      <gmap-autocomplete @place_changed="setPlace" class="direction__input" ref="input" @click.native="changeInput">
      </gmap-autocomplete>

      <button type="button" name="button" class="searchbar__btn" @click="clearInput" v-show="isShowClearBtn" title="clear search">
        <img src="../assets/img/close.png" alt="">
      </button>
    </div>


    <label for="" class="position-absolute direction__label direction__bar">{{ parkingAddress }}</label>

    <div class="mask position-absolute" v-show="showMask" @click="toggleMask"></div>
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
const destinationMarkerImg = require('../assets/img/destination.png')

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
      parkingCoords: {},
      parkingAddress: null,
      directionsService: null,
      directionsDisplay: null,
      isShowClearBtn: true,
      showMask: false,
      zIndex: 0,
      startPointAddress: null
    }
  },
  methods:{
    getDetails(){
      this.$router.push('/detail?lat=' + this.parkingCoords.lat + '&lng=' + this.parkingCoords.lng)
    },
    toggleMask(){
      this.showMask = false

      if(this.startPointAddress === null){
        this.isShowClearBtn = false
      }
      this.$refs.input.$el.value = this.startPointAddress
    },
    clearInput(){
      this.showMask = true,
      this.zIndex = 9
      this.$refs.input.$el.value = ''
    },
    changeInput(){
      this.isShowClearBtn = true
      this.showMask = true,
      this.zIndex = 9
    },
    getUserLocation(){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition)
      }else{
        console.log("not supported")
      }
    },
    showPosition(position){
      var latLng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      this.updateStartPointInput(latLng)
      this.directionsDisplay.setMap(null)
      this.getDirection(latLng)
      this.$localStorage.set('geoLocation', latLng)

      for (var i=0; i<this.markers.length; i++){
        if(this.markers[i].title === "destination"){
          this.markers.splice(i, 1)
        }
      }

      for (var i=0; i<this.markers.length; i++){
        if(this.markers[i].title === "user"){
          this.markers.splice(i, 1)
        }
      }

      this.addNewMarker(latLng)
    },
    addNewMarker(currentLocation){
      var userLocationMarker = {
        position: currentLocation,
        icon: centerMarkerImg,
        clickable: false,
        title: "user"
      }
      this.markers.push(userLocationMarker)
    },
    setPlace(place){
      this.startPointAddress = this.$refs.input.$el.value
      this.showMask = false
      this.zIndex = 0

      for (var i=0; i<this.markers.length; i++){
        if(this.markers[i].title === "destination"){
          this.markers.splice(i, 1)
        }
      }

      var latLng = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
      var startPoint = {
        position: latLng,
        icon: destinationMarkerImg,
        clickable: false,
        title: "destination"
      }
      this.markers.push(startPoint)
      if(this.destinationDisplay){
        this.directionsDisplay.setMap(null)
      }

      this.getDirection(latLng)

    },
    getDirection(startPoint){
      this.directionsService = new google.maps.DirectionsService
      this.directionsDisplay = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#21D331"
        }
      })
      this.directionsDisplay.setMap(this.$refs.map.$mapObject)
      let currentLocation = this.$localStorage.get('geoLocation')
      if(typeof currentLocation !== 'object'){
        currentLocation = JSON.parse(currentLocation)
      }
      var start = new google.maps.LatLng(startPoint.lat, startPoint.lng)
      var end = new google.maps.LatLng(this.parkingCoords.lat, this.parkingCoords.lng)
      var self = this
      this.directionsService.route({
        origin: start,
        destination: end,
        travelMode: 'DRIVING'
      }, function(response, status) {
        if (status === 'OK') {
          self.directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      })

      this.zoomValue = this.$refs.map.$mapObject.getZoom()
    },
    createMarkers(){
      // get coords from $route
      var query = this.$route.query
      this.parkingCoords = {
        lat: Number(query.lat),
        lng: Number(query.lng)
      }

      //create parking marker
      var parkingMarker ={
        position: {lat: this.parkingCoords.lat, lng: this.parkingCoords.lng},
        icon: inactiveMarkerImg,
        label: {
          text: '0',
          color: "white",
          fontWeight: "700",
          fontSize: "24px",
          fontFamily: "arial"
        },
        title: "parking"
      }
      this.markers.push(parkingMarker)

      // create user location marker
      let currentLocation = this.$localStorage.get('geoLocation')
      if(this.isEmptyObj(currentLocation)){

      }else{
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
        this.markers.push(userLocationMarker)
      }

    },
    updateDestinationLabel(coords){
      var geocoder = new google.maps.Geocoder
      var self = this
      geocoder.geocode({'location': coords}, function(results, status) {
        if (status === 'OK') {
          if (results[1]) {
            self.parkingAddress = results[1].address_components[0].long_name
          } else {
            self.parkingAddress = "Selected Parking Lot"
          }
        } else {
          self.parkingAddress = "Selected Parking Lot"
        }
      })
    },
    updateStartPointInput(coords){
      var geocoder = new google.maps.Geocoder
      var self = this
      geocoder.geocode({'location': coords}, function(results, status) {
        if (status === 'OK') {
          if (results[1]) {
            var address = results[1].address_components[0].long_name
            self.$refs.input.$el.value = address
            self.startPointAddress = address
          } else {
            self.$refs.input.$el.value = "My Location"
          }
        } else {
          self.$refs.input.$el.value = "My Location"
        }
      })
    },
    isEmptyObj(obj){
      for(var key in obj) {
        if(obj.hasOwnProperty(key))
          return false;
      }
      return true;
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
    var geoLocation = this.$localStorage.get('geoLocation')
    if(this.isEmptyObj(geoLocation)){
      this.isShowClearBtn = false
      this.center = this.parkingCoords
      const _this = this
      var checkGoogle = setInterval(function () {
        if (window.google) {
          clearInterval(checkGoogle)
          _this.updateDestinationLabel(_this.parkingCoords)
        }
      }, 10)
    }else{
      if(typeof geoLocation !== 'object'){
        geoLocation = JSON.parse(geoLocation)
      }
      const _this = this
      var checkGoogle = setInterval(function () {
        if (window.google) {
          clearInterval(checkGoogle)
          _this.updateDestinationLabel(_this.parkingCoords)
          _this.getDirection(geoLocation)
          _this.updateStartPointInput(geoLocation)
        }
      }, 10)
    }
  }
}
</script>

<style>
  .direction__bar{
    left: 75px;
    height: 44px;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    line-height: 44px;
    font-size: 14px;
  }
  .direction__label{
    top: 90px;
    padding: 0 10px;
    width: calc(100% - 115px);
  }

  .direction__start-point{
    top: 35px;
    display: flex;
    width: calc(100% - 95px);

  }

  .direction__input{
    width: calc(100% - 64px);
    padding: 0 10px;
    font-size: 14px;
  }

</style>
