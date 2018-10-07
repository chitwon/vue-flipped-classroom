<template>
  <v-container fluid="fluid" class="text-xs-center">
    <div v-html="ques"></div>
    <v-btn @click="showSol = !showSol">Solution</v-btn>
    <v-btn @click="showHint()">Hint</v-btn>
    <div v-html="sol" v-if="showSol"></div>
  </v-container>
</template>

<script>
  import KaTeX from 'katex'
  import * as MathCart from '@/assets/js/problems.js'
  export default {
    name: 'HelloWorld',
    data () {
      return {
        sol: MathCart.factorToPrimes(KaTeX).sol,
        hint: MathCart.factorToPrimes(KaTeX).hint,
        ques: MathCart.factorToPrimes(KaTeX).ques,
        steps: MathCart.factorToPrimes(KaTeX).steps,
        showSol: false
      }
    },
    computed: {
      isAuthenticated: function () {
        return this.$store.getters.isAuthenticated
      }
    },
    methods: {
      showHint () {
        console.log('Problem.vue call of showHint(), will next dispatch toggleRightDrawer ')
        this.$store.dispatch('toggleRightDrawer', {rightDrawer: !this.$store.getters.rightDrawer, steps: this.steps})
        console.log('end of showHint()')
      }
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

