<template>
  <v-app>
    <v-navigation-drawer
      fixed
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      app
    >
      <v-list>
        <v-list-tile-content >
          <router-link to="home" class="listing">
            <v-btn flat><v-icon left >home</v-icon>Home</v-btn>
          </router-link>
        </v-list-tile-content>
        <v-list-tile-content>
          <Login></Login>
        </v-list-tile-content>
        <v-list-tile-content>
          <router-link to="video-list" class="listing">
            <v-btn flat><v-icon left >ondemand_video</v-icon>Video</v-btn>
          </router-link>
        </v-list-tile-content>
        <v-list-tile-content>
          <router-link to="docs" class="listing">
            <v-btn flat><v-icon left >folder</v-icon>Documents</v-btn>
          </router-link>
        </v-list-tile-content>
        <v-list-tile-content>
          <router-link to="examples" class="listing">
            <v-btn flat><v-icon left >note</v-icon>Example Problems</v-btn>
          </router-link>
        </v-list-tile-content>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar fixed app :clipped-left="clipped" color="indigo" dark>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>web</v-icon>
      </v-btn>
      <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>remove</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="rightDrawerBool = !rightDrawerBool">
        <v-icon>menu</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content>
      <v-container fluid>
        <v-slide-y-transition mode="out-in">
          <v-layout column align-center>
            <router-view></router-view>
          </v-layout>
        </v-slide-y-transition>
      </v-container>
    </v-content>

    <v-navigation-drawer
      temporary
      :right="right"
      v-model="rightDrawerBool"
      fixed
    >
      <v-list>
        <v-list-tile @click.native="right = !right">
          <v-list-tile-action>
            <v-icon>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me to change)</v-list-tile-title>
        </v-list-tile>
      </v-list>
      <div v-html="rightDrawerHtml"></div>
    </v-navigation-drawer>

    <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>

  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        clipped: true,
        drawer: true,
        fixed: false,
        items: [{
          icon: 'bubble_chart',
          title: 'Inspire'
        }],
        miniVariant: false,
        right: true,
        rightDrawerBool: false,
        title: 'MathCart.com'
      }
    },
    computed: {
      givenName: function () {
        return this.$store.getters.givenName
      },
      rightDrawerHtml: function () {
        console.log('App.vue computed rightDrawerHtml')
        this.rightDrawerBool = true
        return this.$store.getters.rightDrawerHtml
      },
      rightDrawerWithSetter: {
        get: function () {
          console.log('app vue getter ')
          return this.$store.getters.rightDrawerBool
        },
        set: function (newValue) {
          // this.$store.getters.rightDrawer = newValue
          console.log('app vue setter ' + newValue)
          this.$store.dispatch('toggleRightDrawer', {rightDrawer: newValue})
        }
      }
    }
  }
</script>
