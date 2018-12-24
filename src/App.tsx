import * as tsx from 'vue-tsx-support'
import { VNode } from 'vue'
import { Adder } from './components/Adder'

import './components/app.css'

import { Sign } from '@/types/sign'
import { IState } from '@/store'

const App = tsx.component({
  name: 'App',

  computed: {
    left(): number {
      return (this.$store.state as IState).calculation.left
    },

    right(): number {
      return (this.$store.state as IState).calculation.right
    },

    sign(): Sign {
      return (this.$store.state as IState).calculation.sign
    },

    result(): number {
      switch (this.sign) {
        case Sign['+']:
          return this.left + this.right
        case Sign['-']:
          return this.left - this.right
        case Sign['x']:
          return this.left * this.right
        case Sign['/']:
          return this.left / this.right
      }
    }
  },

  methods: {
    changeSign(sign: Sign) {
      this.$store.commit('calculation/SET_SIGN', sign)
    }
  },

  render(): VNode {
    return (
      <Adder 
        left={this.left}
        right={this.right}
        selectedSign={this.sign}
        onChangeSign={this.changeSign}
      >
        <div slot='result'>
          {this.result}
        </div>
      </Adder>
    )
  }
})

export { App }