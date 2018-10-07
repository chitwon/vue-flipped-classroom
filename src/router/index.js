import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/functions/Login'
import VideoList from '@/components/VideoList'
import Videos from '@/components/Videos'
import VueAuthenticate from 'vue-authenticate'
import Gdocs from '@/components/Gdocs'
import Examples from '@/components/Examples'

import Problem from '@/components/Problem'

import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)
Vue.use(Router)

Vue.use(VueAuthenticate, {
  providers: {
    google: {
      clientId: '740243268480-ukalbakddeujd2m2svde17c6prhdfmqf.apps.googleusercontent.com',
      redirectUri: process.env.GOOGLE_REDIRECT,
      url: process.env.API_CALLBACK,
      scope: ['openid', 'https://www.googleapis.com/auth/drive', 'profile', 'email'],
      scopePrefix: '',
      requiredUrlParams: ['scope'],
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth'
      // redirectUri: window.location.origin + '/login'
    }
  },
  bindResponseInterceptor: function () {
    this.$http.interceptors.response.use((response) => {
      // check all responses
      // in this case, response pass from mathcart API that includes google's authentication response.
      console.log('resp c;', response)
      return response
    })
  },
  bindRequestInterceptor: function () {
    this.$http.interceptors.request.use((config) => {
      return config
    })
  }

})

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '*',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/videos',
      name: 'Videos',
      component: Videos
    },
    {
      path: '/video-list',
      name: 'Video-list',
      component: VideoList
    },
    {
      path: '/docs',
      name: 'Docs',
      component: Gdocs
    },
    {
      path: '/examples',
      name: 'Docs2',
      component: Examples
    },
    {
      path: '/problem',
      name: 'Problem',
      component: Problem
    }
  ]
})
