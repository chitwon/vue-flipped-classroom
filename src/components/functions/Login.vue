<template>
  <div id="login">
    <v-btn flat  v-if="isAuthenticated" @click="authLogout()">
      <v-icon left >perm_identity</v-icon>
      <v-spacer></v-spacer>
      {{ givenName }} - Logout
    </v-btn>
    <v-btn flat  v-else @click="authenticate('google')"> <v-icon left >perm_identity</v-icon> <v-spacer></v-spacer> Google Login </v-btn>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        isLoggedIn: this.$auth.isAuthenticated()
        // givenName: null
      }
    },
    computed: {
      isAuthenticated: function () {
        return this.$store.getters.isAuthenticated
      },
      givenName: function () {
        return this.$store.getters.givenName
      }
    },
    methods: {
      authenticate: function (provider) {
        this.$store.dispatch('authenticate', {'provider': provider})
      },
      authLogout: function () {
        this.$auth.logout().then(() => {
          if (!this.$auth.isAuthenticated()) {
            this.$store.dispatch('logout')
            this.response = null
            this.isLoggedIn = false
          }
        })
      }
    },
    mounted () {
      console.log('authentication stored: ', this.$store.getters.isAuthenticated)
    }
  }
</script>
