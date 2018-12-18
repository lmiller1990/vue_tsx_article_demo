import * as tsx from 'vue-tsx-support'
import { VNode } from 'vue'

import { Sign } from '@/types/sign'

interface IEvents {
  onChangeSign: (sign: Sign) => void
}

interface IAdderData {
  signs: Sign[]
}

const Adder = tsx.componentFactoryOf<IEvents>().create({
  name: 'Adder',

  props: {
    left: {
      type: Number,
      required: true as true
    },

    right: {
      type: Number,
      required: true as true
    },

    selectedSign: {
      type: String as () => Sign,
      required: true as true
    }
  },

  data(): IAdderData {
    return {
      signs: [
        Sign["+"],
        Sign["-"],
        Sign["x"],
        Sign["/"]
      ]
    }
  },

  render(): VNode {
    const { signs, left, right, selectedSign } = this

    return (
      <div class='wrapper'>
        <div class='inner'>
          <div class='number'>
            {left}
          </div>

          <div class='signs'>
            {signs.map(sign =>
              <span 
                class={sign === selectedSign ? 'selected sign' : 'sign'}
                onClick={() => this.$emit('changeSign', sign)}
              >
                {sign}
              </span>)
            }
          </div>

          <div class='number'>
            {right}
          </div>
        </div>

        <div class='result'>
          <span>
            Result: {this.$slots.result}
          </span>
        </div>
      </div>
    )
  }
})

export { Adder }
