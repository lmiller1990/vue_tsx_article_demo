import { Module } from 'vuex'

import { Sign } from '@/types/sign'

interface ICalculationState {
  left: number
  right: number
  sign: Sign
}

const SET_SIGN = 'SET_SIGN'

const calculation: Module<ICalculationState, {}> = {
  namespaced: true,

  state: {
    left: 3,
    right: 1,
    sign: Sign['+']
  },

  mutations: {
    [SET_SIGN](state, payload: Sign) {
      state.sign = payload
    }
  },

  getters: {
    theSign(state): Sign {
      return state.sign
    }
  }
}

export {
  calculation,
  ICalculationState
}
