import Vue from 'vue'
import Vuex from 'vuex'

import { calculation, ICalculationState } from './calculation'

Vue.use(Vuex)

interface IState {
  calculation: ICalculationState
}

const store = new Vuex.Store<IState>({
  modules: {
    calculation
  }
})

export { store, IState } 