<template>
  <v-container fluid="fluid" class="text-xs-center">
    <h1>Welcome to MathCart.com </h1>
    <p>MathCart.com is being rebuilt. New content and features will be continually added as developed.</p>
    <v-carousel class="indigo lighten-4  ">
      <v-carousel-item
        v-for="(item,i) in list()"
        v-bind:src="'url(data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAU1QTFRFNjtAQEVK)'" :key="i"
      >
        <v-flex >
          <div v-html="item.text"></div>
        </v-flex>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script>
  import KaTeX from 'katex'
  import * as MathCart from '@/assets/js/home.js'
  export default {
    name: 'HelloWorld',
    data () {
      return {
        items: [
          {
            text: MathCart.text(KaTeX)
          },
          {
            text: MathCart.text(KaTeX)
          },
          {
            text: MathCart.text(KaTeX)
          },
          {
            text: MathCart.text(KaTeX)
          }
        ]
      }
    },
    methods: {
      text: function () {
        try {
          return KaTeX.renderToString('x^2')
        } catch (err) {
          return ''
        }
      },
      changeText () {
        console.log('change')
      },
      list: function () {
        let list = []
        for (let i = 0; i < 20; i++) {
          list.push({
            text: MathCart.text(KaTeX)
          })
        }
        return list
      }
    },
    computed: {
      _expr: function () {
        try {
          return KaTeX.renderToString('x^2')
        } catch (err) {
          return ''
        }
      }
    },
    mounted () {
      console.log('mount')
      console.log(KaTeX.renderToString('x^2'))
    }
  }
</script>

<style>
  .g-signin-button {
    /* This is where you control how the button looks. Be creative! */
    display: inline-block;
    padding: 4px 8px;
    border-radius: 3px;
    background-color: #3c82f7;
    color: #fff;
    box-shadow: 0 3px 0 #0f69ff;
  }
  .carousel {
    background: rgba(0, 0, 0, 0) !important;
  }
</style>

