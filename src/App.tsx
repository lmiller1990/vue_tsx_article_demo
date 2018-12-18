import * as tsx from 'vue-tsx-support'
import { VNode } from 'vue'
import { Adder } from './components/Adder'

import { Sign } from '@/types/sign'

const App = tsx.component({
  name: 'App',

  methods: {
    changeSign(sign: Sign) {

    }
  },

  render(): VNode {
    return (
      <Adder 
        left={5}
        right={3}
        selectedSign={Sign['+']}
        onChangeSign={this.changeSign}
      />
    )
  }
})

export { App }