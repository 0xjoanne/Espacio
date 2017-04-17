<template>
  <div class="details__content">
    <div class="details__data">
      <h3 class="details__title">Impark</h3>
      <p class="details__address">130 Adelaide St W, Toronto, ON M5H 3P5</p>
      <ul class="details__list">
        <li class="details__item">
          <p class="item__value">10/50</p>
          <p class="item__title">Avaibale</p>
        </li>
        <li class="details__item">
          <p class="item__value">$5/h</p>
          <p class="item__title">Price</p>
        </li>
        <li class="details__item">
          <p class="item__value">11min</p>
          <p class="item__title">Time</p>
        </li>
        <li class="details__item">
          <p class="item__value">3.5km</p>
          <p class="item__title">Distance</p>
        </li>
      </ul>
    </div>
    <div class="details__chart">
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

      <bar-chart class="details__canvas"></bar-chart>
    </div>
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

    }
  }
}
</script>

<style>
  .details__content{
    width: 100vw;
    height: 65vh;
  }
  .details__data{
    border-bottom: 1px solid #eee;
  }
  .details__title,
  .details__address{
    line-height: 36px;
  }
  .details__list{
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
  .details__data,
  .details__chart{
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
    height: 52px;
    width: 52px;
    background: url('../assets/img/back-btn.png') no-repeat center center;
    top: 35px;
    left: 20px;
  }
  .direction-btn{
    height: 70px;
    width: 70px;
    background: url('../assets/img/direction.png') no-repeat center center;
    right: 20px;
    top: calc(35vh - 35px);
  }
  .details__canvas{
    width: 100%;
    height: calc(65vh - 265px);
  }
</style>
