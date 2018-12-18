Create a new app by running `vue create tsx_adder`. 

For each of prompts:

- The only feature we want is TypeScript and Babel, so select those two. 
- We do not want the class-style component syntax
- no need for babel in this simple demo
- select "in dedicated files" for the config

Once that has finished installing, `cd tsx_adder`. We need one dependency to be able to use TSX. That is `vue-tsx-support`. Install in by running `vue add tsx-support`. We will also demonstrate Vuex with TypeScript, so add it with `yarn add vuex`.

The app we are building will look like this:

You can select a sign, and it will perform the calculation.

## Structure

The application will have two components: `AdderContainer` and `Adder`. The `AdderContainer` will connect to the Vuex store and pass props to the `Adder`, which is the presentation component that will handle the layout and UI. As per the container/presenter pattern (also known as smart/dumb, container/component), `Adder` receives data from the store via props, and communicates with the parent by emitting events. This will let us demonstrate:

- typesafe props, including complex types like Enums and Objects
- typechecked events between the parent/child component
- how to get type inference and type safety with Vuex

Start off by converting `App.vue` to `App.tsx`. Update it to contain the following:

```tsx
import * as tsx from 'vue-tsx-support'
import { VNode } from 'vue'

const App = tsx.component({
  name: 'App',

  render(): VNode {
    return (
      <Adder />
    )
  }
})

export { App }
```

Since we haven't created `Adder` yet, create it: `components/Adder.tsx`. Inside `components/Adder.tsx`, add the following bare-bones component:

```tsx
import * as tsx from 'vue-tsx-support'
import { VNode } from 'vue'
import { Adder } from './components/Adder'

const Adder = tsx.component({
  name: 'Adder',

  render(): VNode {
    return (
      <div>Adder</div>
    )
  }
})

export { Adder }
```

Now import it in `App.tsx`: `import { Adder } from './components/Adder'. Lastly, head to `main.ts` and change `import App from './App.vue` to `import { App } from './App'. Run `yarn serve` (or `npm run serve`). `localhost:8080` should show the following:

SS_1

## Typesafe Props

The first thing we will demonstrate is typesafe props, including both primitives (like `Number` and `Boolean`) as well as complex types, like `Enum`. In `Adder.tsx`, add the following:

```tsx
props: {
  left: {
    type: Number,
    required: true as true
  },

  right: {
    type: Number,
    required: true as true
  }
},
```

One caveat is you need to type `true as true` to get TypeScript to check the props at compile time. It is discussed breifly [here](https://github.com/wonderful-panda/vue-tsx-support#available-apis-to-add-type-information). One you add that, if your editor supports TypeScript (for example VS Code), head back to `App.tsx`, and you should see an error, and `<Adder >` has a red line under it. Towards the end of the error message, it says `Type '{}' is missing the following properties from type '{ left: number; right: number; }': left, right`. Let's provide `left` and `right` in `App.tsx`:

```tsx
render(): VNode {
  return (
    <Adder 
      left={5}
      right={3}
    />
  )
}
```

Try passing a string instead - TypeScript will warn us the prop type is incorrect.

Next, let's add a more complex type - an enum. Create a directory called `types` under `src`, and inside it a `sign.ts` file with the following:

```tsx
enum Sign {
  'x' = 'x',
  '/' = '/',
  '+' = '+',
  '-' = '-'
}

export { Sign }
```

Next update `Adder.tsx`:

```tsx
import { Sign } from '@/types/sign'

// ...

props: {
  selectedSign: {
    type: String as () => Sign,
    required: true as true
  }
}

Another unforunately hack, which shows some of the limits of Vue's TS support is `String as () => Sign`. Since our `Sign` enum is just Strings, we do `String as () => ...`. If it was an enum of `Object` or `Array`, we would type `Array as () => MyComplexArrayType[]`. More information about this is found [here](https://frontendsociety.com/using-a-typescript-interfaces-and-types-as-a-prop-type-in-vuejs-508ab3f83480).

Head back to `App.tsx`, and you'll see another error around `<Adder />`. Fix it by adding the following:

```tsx
// ...
import { Sign } from '@/types/sign'

// ...

  render(): VNode {
    return (
      <Adder 
        left={5}
        right={3}
        selectedSign={Sign['+']}
      />
    )
  }
```

## Typesafe Events

Now let's see how to have typechecked events. We want the adder to emit a `changeSign` event when any of the four signs are clicked. This can be achieved using `componentFactoryOf`, documented [here](https://github.com/wonderful-panda/vue-tsx-support#componentfactoryof). Start by updating `App.tsx`:

```tsx
// imports...
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
```

`<Adder />` has an error again: `Property 'onChangeSign' does not exist on type '({ props: ...`. That's because we are passing a prop that `Adder` doesn't expect.

Add the following to `Adder.tsx`:

```tsx
interface IEvents {
  onChangeSign: (sign: Sign) => void
}

const Adder = tsx.componentFactoryOf<IEvents>().create({

  // ...
})
```

Now the error is gone. Try changing the signature of `changeSign(sign: Sign)` to `changeSign(sign: Number)` - TS warns you the parameter has the  incorrect type, very cool. Read more about `componentFactoryOf` [here](https://github.com/wonderful-panda/vue-tsx-support#componentfactoryof).

Two last things to complete the `Adder.tsx` component. First, add the following interface at the top, and `data` function:

```tsx
// imports ...
interface IAdderData {
  signs: Sign[]
}

const Adder = tsx.componentFactoryOf<IEvents>().create({
  // ...
  
  data(): IAdderData {
    return {
      signs: [
        Sign["+"],
        Sign["-"],
        Sign["x"],
        Sign["/"]
      ]
    }
  }
```

Lastly, let's add the `render` function for `Adder.tsx`. It isn't anything special, so I won't go into detail.

```tsx
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
```