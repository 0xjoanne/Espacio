<template>
  <div id="app">
    <transition>
      <router-view></router-view>
    </transition>
  </div>
</template>

<style>
  *{
    padding: 0;
    margin: 0;
    font-family: 'Source Sans Pro', sans-serif;
    color: #4a4a4a;
  }
  li{
    list-style: none;
  }
  a{
    text-decoration: none;
  }
  button{
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
  }
  input{
    outline: none;
    border: none;
  }
  .position-absolute{
    position: absolute;
  }
  ::-webkit-input-placeholder { /* Chrome */
    color: #bbb;
  }
  :-ms-input-placeholder { /* IE 10+ */
    color: #bbb;
  }
  ::-moz-placeholder { /* Firefox 19+ */
    color: #bbb;
  }
  :-moz-placeholder { /* Firefox 4 - 18 */
    color: #bbb;
  }
</style>
