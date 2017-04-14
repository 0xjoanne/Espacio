<template>
  <div class="home">
    <div class="home__logo">
      <img src="../assets/img/logo.png" alt="">
    </div>
    <div class="home__btns">
      <!-- <button type="button" name="button" class="home__btn" @click="getUserLocation">
        <img src="../assets/img/target-btn.png" alt="">
      </button> -->
      <router-link to="/result?action=getUserLocation" class="home__btn" @click="">
        <img src="../assets/img/target-btn.png" alt="">
      </router-link>

      <router-link to="/result?action=enterLocation" class="home__btn">
        <img src="../assets/img/search-btn.png" alt="">
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  components: {

  },
  data(){
    return{
      currentLocation: {
        lat: null,
        lon: null
      },
      link: ''
    }
  },
  methods:{
    getUserLocation(){
      // if (navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(this.showPosition)
      // }
    },
    showPosition(position){
      this.currentLocation.lat = position.coords.latitude
      this.currentLocation.lon = position.coords.longitude
    }
  }
}
</script>

<style>
  .home{
    width: 100vw;
    height: 100vh;
    background: url('../assets/img/bg.png') repeat;
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    align-items: center;
  }

  .home__logo{
    margin-bottom: 70px;
  }

  .home__btn{
    display: block;
    margin-bottom: 10px;
  }

</style>
