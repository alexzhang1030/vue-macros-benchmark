const code = `
import { defineComponent as _defineComponent } from 'vue'
import { openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"
import { h } from 'vue'

export default _defineComponent({
    __name: 'basic',
    setup(__props) {
        defineRender(() => h('div'))
        return (_ctx, _cache) => {
            return _openBlock(), _createElementBlock("div")
        }
    }
})
`

import b from 'benny'
import * as swc from '@swc/core'
import { transformDefineRender } from './macro.js'

b.suite(
  'Example',

  b.add('swc', async () => {
    const arr = new Array(100).fill(swc.transform(code, {
      jsc: {
        target: "es2016",
        experimental: {
          plugins: [
            ["swc-plugin-vue-macros-define-render", {}]
          ]
        }
      }
    }))
    await Promise.all(arr)
  }),

  b.add('babel', async () => {
    const arr = new Array(100).fill(new Promise(res => {
      transformDefineRender(code, "index.vue")
      res()
    }))
    await Promise.all(arr)
  }),

  b.cycle(),
  b.complete(),
)
