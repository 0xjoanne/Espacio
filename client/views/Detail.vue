<template>
  <div class="detail">
    <gmap-map
      :center="center"
      :zoom="zoomValue"
      :options="{ styles: styles, disableDefaultUI: true}"
      style="width: 100vw; height: 35vh"
      ref="map"
    >
      <gmap-marker
        v-for="(marker,index) in markers"
        :key="index"
        :position="marker.position"
        :clickable="true"
        :draggable="false"
        @click="center=marker.position"
        :icon="marker.icon"
        :label="marker.label"
        cursor="pointer"
      ></gmap-marker>
    </gmap-map>
    <div class="detail__content">
      <div class="detail__data">
        <h3 class="detail__title">Impark</h3>
        <p class="detail__address">130 Adelaide St W, Toronto, ON M5H 3P5</p>
        <ul class="detail__list">
          <li class="detail__item">
            <p class="item__value">{{ parkingLeft }}/{{ parkingSpace }}</p>
            <p class="item__title">Avaibale</p>
          </li>
          <li class="detail__item">
            <p class="item__value">$5/h</p>
            <p class="item__title">Price</p>
          </li>
          <li class="detail__item">
            <p class="item__value">11min</p>
            <p class="item__title">Time</p>
          </li>
          <li class="detail__item">
            <p class="item__value">3.5km</p>
            <p class="item__title">Distance</p>
          </li>
        </ul>
      </div>
      <div class="detail__chart">
        <div class="select-wrapper">
          <select class="day-picker" name="">
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednsday">Wednsday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Monday</option>
          </select>
        </div>

        <p class="live-msg">
          <span class="live-label">Live</span> A little busy
        </p>

        <bar-chart class="detail__canvas"></bar-chart>
      </div>
    </div>

    <button type="button" name="button" class="back-btn position-absolute" @click="backToPrev"></button>

    <button type="button" name="button" class="direction-btn position-absolute" @click="getDirection"></button>
  </div>
</template>

<script>
import BarChart from '../assets/js/barChart'

const locationMarkerImg = require('../assets/img/location-marker.png')

export default {
  components:{
    BarChart
  },
  data(){
    return{
      zoomValue: 16,
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
      center: {lat: 43.6529122, lng: -79.4003388},
      markers: []
    }
  },
  methods:{
    backToPrev(){
      this.$router.push('/result')
    },
    getDirection(){
      var query = this.$route.query
      this.$router.push('/direction?lat=' + query.lat + '&lng=' + query.lng)
    }
  },
  computed:{
    parkingLeft(){
      if(this.$store.state.parkingMock){
        return this.$store.state.parkingMock.left
      }else{
        return 0
      }
    },
    parkingSpace(){
      if(this.$store.state.parkingMock){
        return this.$store.state.parkingMock.space
      }else{
        return 0
      }
    }
  },
  mounted(){
    var latLng = {
      lat: Number(this.$route.query.lat),
      lng: Number(this.$route.query.lng)
    }
    var markerInfo = {
      position: latLng,
      icon: locationMarkerImg,
      title: "parking"
    }
    this.markers.push(markerInfo)
    this.center = latLng
  }
}

</script>

<style>
  .detail__content{
    width: 100vw;
    height: 65vh;
  }
  .detail__data{
    border-bottom: 1px solid #eee;
  }
  .detail__title,
  .detail__address{
    line-height: 36px;
  }
  .detail__list{
    display: flex;
    justify-content: space-between;
    text-align: center;
    margin-top: 10px;
  }
  .item__value{
    color: #21D331;
    font-size: 18px;
  }
  .item__title{
    font-weight: 300;
  }
  .detail__data,
  .detail__chart{
    padding: 20px 24px;
  }
  .select-wrapper{
    position: relative;
    width: 85px;
    margin-bottom: 15px;
  }
  .select-wrapper:before{
    content: '';
    display: block;
    height: 0;
    width: 0;
    position: absolute;
    right: 0;
    top: 8px;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 7px solid #4A4A4A;
    z-index: -9;
  }
  .day-picker{
    width: 85px;
    appearance: none;
    border: none;
    background:  none;
    outline: none;
    color: #333;
    font-size: 15px;
  }

  .live-msg{
    line-height: 24px;
  }
  .live-label{
    background: #F06778;
    color: white;
    width: 50px;
    height: 24px;
    font-weight: bold;
    display: inline-block;
    text-align: center;
    border-radius: 4px;
    margin-right: 5px;
  }
  .back-btn{
    width: 44px;
    height: 44px;
    background: white url('../assets/img/back.png') no-repeat center center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    top: 35px;
    left: 20px;
    text-align: center;
  }
  .direction-btn{
    height: 70px;
    width: 70px;
    background: url('../assets/img/direction.png') no-repeat center center;
    right: 20px;
    top: calc(35vh - 35px);
  }
  .detail__canvas{
    width: 100%;
    height: calc(65vh - 265px);
  }

  #bar-chart{
    width: 100% !important;
    height: 100% !important;
  }
</style>
