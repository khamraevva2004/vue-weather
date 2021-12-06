import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    goods_count: 0,
  },
  mutations: {
    ADD_GOOD(state, count) {
      console.log('a')
      state.goods_count = state.goods_count + count
    }
  }
})