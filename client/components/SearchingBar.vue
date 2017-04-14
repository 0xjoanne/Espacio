<template>
  <div class="searching-bar">
    <button type="button" name="button" class="searchbar__btn">
      <img src="../assets/img/menu.png" alt="">
    </button>
    <input type="text" name="" value="" class="searchbar__input" @click="enterLocation">
    <button type="button" name="button" class="searchbar__btn">
      <img src="../assets/img/close.png" alt="">
    </button>
  </div>
</template>

<script>
export default {
  data(){
    return{
      imgSrc: 'menu',
    }
  },
  methods:{
    enterLocation(){
      this.$parent.isEntering = true
    }
  },
  computed: {

  }
}
</script>

<style>
  .search-bar{
    width: 88%;
    height: 44px;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    display: flex;
  }
  .searchbar__input{
    height: 44px;
    width: calc(100% - 88px);
    font-size: 14px;
    color: #9b9b9b;
    padding: 0 10px;
  }
  .searchbar__btn{
    width: 44px;
    height: 44px;
  }
</style>
