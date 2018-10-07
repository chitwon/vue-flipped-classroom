import Vue from 'vue'
import Vuex from 'vuex'
import VueAxios from 'vue-axios'
import { VueAuthenticate } from 'vue-authenticate'
import axios from 'axios'

Vue.use(Vuex)
Vue.use(VueAxios, axios)

const vueAuth = new VueAuthenticate(Vue.prototype.$http, {
  baseUrl: 'http://localhost:4000'
})

Vue.use(Vuex)

export const store = new Vuex.Store({
  // You can use it as state property
  state: {
    isAuthenticated: vueAuth.isAuthenticated(),
    givenName: (window.localStorage.getItem('givenName') ? window.localStorage.getItem('givenName') : 'guest'),
    rightPanel: false,
    googleApiKey: 'AIzaSyAAnXxFOq4sRi5f0uJhTPYZtwmY011CcH8',
    userSheet: (window.localStorage.getItem('userSheet') ? window.localStorage.getItem('userSheet') : null),
    rightDrawer: false,
    rightDrawerHtml: ''
  },
  // You can use it as a state getter function (probably the best solution)
  getters: {
    isAuthenticated (state) {
      return state.isAuthenticated
    },
    rightDrawer (state) {
      return state.rightDrawer
    },
    givenName (state) {
      return state.givenName
    },
    googleApiKey (state) {
      return state.googleApiKey
    },
    userSheet (state) {
      return state.userSheet
    },
    rightDrawerHtml (state) {
      return state.rightDrawerHtml
    }
  },
  // Mutation for when you use it as state property
  mutations: {
    isAuthenticated (state, payload) {
      state.isAuthenticated = payload.isAuthenticated
    },
    givenName (state, payload) {
      state.givenName = payload.givenName
    },
    userSheet (state, payload) {
      state.userSheet = payload.userSheet
    },
    rightDrawer (state, bool) {
      console.log('store commit rightDrawer')
      state.rightDrawer  = bool
    },
    rightDrawerHtml (state, steps) {
      let size = steps.length
      let html = ''
      for (let i = 0; i < size; i++) {
        if (steps[i].hint !== undefined) html += '<p>' + steps[i].hint + '</p>'
      }
      state.rightDrawerHtml = html
    },
    fillHints (state, objs) {
      console.log('store commit fillHints', objs)
      return true
    }
  },
  actions: {
    // Perform VueAuthenticate login using Vuex actions
    login (context, payload) {
      vueAuth.login(payload.user, payload.requestOptions).then((response) => {
        context.commit('isAuthenticated', {
          isAuthenticated: vueAuth.isAuthenticated()
        })
      })
    },
    setGivenName (context, payload) {
      // sets the user name in state
    },
    toggleRightDrawer (context, obj) {
      console.log('start of store - toggleRightDrawer(): ', obj)
      context.commit('rightDrawer', obj.rightDrawer)
      context.commit('rightDrawerHtml', obj.steps)
    },
    authenticate (context, payload) {
      vueAuth.authenticate(payload.provider).then((response) => {
        // local storage
        window.localStorage.setItem('givenName', response.data.givenName)
        window.localStorage.setItem('userSheet', response.data.sheetId)
        console.log('google sheet response: ', response.data.sheetId)
        context.commit('isAuthenticated', {
          isAuthenticated: vueAuth.isAuthenticated()
        })
        context.commit('givenName', {
          givenName: response.data.givenName
        })
        context.commit('userSheet', {
          userSheet: response.data.sheetId
        })
      }, (error) => {
        console.log('authenticate error: ')
        console.log(error)
      }).catch(function (err) {
        console.log('authenticate catch... ')
        console.log(err)
      })
    },
    logout (context) {
      if (window.localStorage) {
        window.localStorage.removeItem('givenName')
        window.localStorage.removeItem('userSheet')
      }
      context.commit('isAuthenticated', {
        isAuthenticated: vueAuth.isAuthenticated()
      })
    }
  }
})
