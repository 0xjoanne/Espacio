import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  connect: false,
  parking: null,
  parkingMock: null,
}

const mutations = {
  SOCKET_CONNECT (state,  status ) {
    console.log('MUTATION SOCKET CONNECT')
    state.connect = true
  },
  SOCKET_DATA (state,data) {
    // console.log(data)
    state.parkingMock = data
  },
  SOCKET_PARKING_CHANGE (state,data) {
    console.log(data)
    state.parking = data
  }
}

const actions = {

}

const store = new Vuex.Store({
  state,
  mutations,
  actions
})


export default store
