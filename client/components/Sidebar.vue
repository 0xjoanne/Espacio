<template>
  <div class="sidebar position-absolute" :style="{transform: showValue ? 'translateX(0)' : 'translateX(-100%)'}">
    <button type="button" name="button" class="sidebar__close-btn" @click="closeSidebar">
      <img src="../assets/img/close.png" alt="">
    </button>
    <div class="sidebar__content">
      <img src="../assets/img/logo.png" alt="" width="182" class="sidebar__logo">
      <ul>
        <li class="sidebar__item">
          <img src="../assets/img/history.png" alt="">
          <span>Parking History</span>
        </li>
        <li class="sidebar__item">
          <img src="../assets/img/feedback.png" alt="">
          <span>Feedback</span>
        </li>
        <li class="sidebar__item">
          <img src="../assets/img/about.png" alt="">
          <span>About Us</span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return{
      showValue: this.value
    }
  },
  methods:{
    closeSidebar(){
      this.showValue = false
      this.$parent.showMask = false
    }
  },
  watch: {
    value (val){
      this.showValue = val
    },
    showValue (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="css">
  .sidebar{
    width: 250px;
    height: 100vh;
    background: white;
    top: 0;
    left: 0;
    transition: all 0.5s;
    transform: translateX(-100%);
  }

  .sidebar__close-btn{
    float: right;
    height: 44px;
    width: 44px;
    margin: 10px 10px 0 0;
  }

  .sidebar__content{
    margin-left: 35px;
  }

  .sidebar__logo{
    margin: 125px 0 80px;
  }

  .sidebar__item{
    margin-bottom: 23px;
    span{
      margin-left: 10px;
    }
    img{
      vertical-align: middle;
    }
  }
</style>
