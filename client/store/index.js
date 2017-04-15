import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  count: 0,
  userLocation: {
    lat: 43.647248,
    lng: -79.403388
  },
  connect: false,
  parking: null,
  parkingMock: null,
}

const mutations = {
  UPDATE(state){
    state.userLocation = "hello world"
  },
  INCREMENT (state) {
    state.count++
  },
  DECREMENT (state) {
    state.count--
  },
  SOCKET_CONNECT (state,  status ) {
    console.log('MUTATION SOCKET CONNECT')
    state.connect = true;
  },
  SOCKET_DATA (state,data) {
    console.log(data);
    state.parkingMock = data;
  },
  SOCKET_PARKING_CHANGE (state,data) {
    console.log(data);
    state.parking = data;
  }
}

const actions = {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('INCREMENT')
  }, 200)
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions
})


export default store
