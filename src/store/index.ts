import Vue from 'vue'
import Vuex, { Store } from 'vuex'

import { calculation, ICalculationState } from './calculation'

Vue.use(Vuex)

interface IState {
  calculation: ICalculationState
}

// class IStore<IState> extends Store<IState> {
//   commitTo(module: string, handler: string, payload: object): void {
//     this.commit(`${module}/${handler}`, payload)
//   }
// }

const store = new Vuex.Store<IState>({
  modules: {
    calculation
  }
})

export { store, IState } 
