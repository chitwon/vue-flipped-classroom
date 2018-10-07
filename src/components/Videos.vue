<template>
  <div>
    <div v-if="!foundVideos">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <v-progress-circular indeterminate color="red"></v-progress-circular>
      <v-progress-circular indeterminate color="purple"></v-progress-circular>
      <v-progress-circular indeterminate color="green"></v-progress-circular>
      <v-progress-circular indeterminate color="amber"></v-progress-circular>
    </div>
    <div v-else>

      <v-menu bottom offset-y>
        <v-btn slot="activator">A Menu</v-btn>
        <v-list two-line>
          <v-list-tile v-for="(sel, i) in select" :key="i" @click="">
            <v-list-tile-title>{{ sel.text }}</v-list-tile-title>
            <v-divider></v-divider>
            <v-list-tile-sub-title v-html="'some new sub  title' + i"></v-list-tile-sub-title>
            <v-divider></v-divider>
          </v-list-tile>
        </v-list>
      </v-menu>

      <div id="videos">
        <youtube :video-id="videoId" @ready="ready" @playing="playing" v-if="foundVideos"></youtube>
      </div>

      <v-btn flat @click="change()">change</v-btn>

    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        foundVideos: false,
        videoId: null,
        items: [
          { header: 'Today' },
          { title: 't1' },
          { divider: true, inset: true },
          { title: 't2' },
          { divider: true, inset: true },
          { title: 't3' }
        ],
        select: null
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
      videos: function () {
        // get the videos from a google sheet shared to public,
        // to do --- set video id in configure
        console.log('start vdo fun', this.foundVideos)
        let self = this
        window.gapi.client.init({
          'apiKey': 'AIzaSyAAnXxFOq4sRi5f0uJhTPYZtwmY011CcH8',
          'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4']
        }).then(function () {
          // to do
          window.gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1L3EOAA0I4sb8JEojaMKCFR81jXBoVIGUEOFMl_bcrEw',
            range: 'Sheet1!A1:D5'
          }).then(function (response) {
            let videoArray = response.result.values
            // set the indexes of video, url, and level
            // ---
            let i = 0
            let videoIndex = null
            let urlIndex = null
            let levelIndex = null
            let videoList = []
            videoArray.forEach(function (row) {
              if (i === 0) {
                console.log('0 elelment', typeof row)
                for (var key in row) {
                  console.log(key, row[key])
                  if (row[key] === 'video') {
                    videoIndex = key
                  }
                  if (row[key] === 'url') {
                    urlIndex = key
                  }
                  if (row[key] === 'level') {
                    levelIndex = key
                  }
                }
                i++
              } else {
                videoList.push({text: row[videoIndex]})
                self.videoId = row[urlIndex]
              }
              console.log('video list:', videoList)
              self.select = videoList
              self.foundVideos = true
            })
            // let videoKey = row[1][1]
            console.log('google sheet response: ', videoIndex, urlIndex, levelIndex)
            // self.foundVideos = true
          }, function (response) {
            console.log('Error: ' + response.result.error.message)
          })
        }, function (response) {
          console.log('vidoe list Error: ' + response.result.error.message)
        })
      },
      start: function () {
        // Initializes the client with the API key and the Translate API.
        window.gapi.client.init({
          'apiKey': 'AIzaSyAAnXxFOq4sRi5f0uJhTPYZtwmY011CcH8',
          'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
          'clientId': '740243268480-ukalbakddeujd2m2svde17c6prhdfmqf.apps.googleusercontent.com',
          'scope': 'https://www.googleapis.com/auth/drive'
        }).then(function () {
          // Executes an API request, and returns a Promise.
          // The method name `language.translations.list` comes from the API discovery.
          console.log('google is auth?: ', window.gapi.auth2.getAuthInstance().isSignedIn.get())
          const params = {
            'spreadsheetId': '1L3EOAA0I4sb8JEojaMKCFR81jXBoVIGUEOFMl_bcrEw',
            'range': 'Sheet1',
            'majorDimension': 'ROWS',
            // How the input data should be interpreted.
            'valueInputOption': 'RAW',
            'insertDataOption': 'INSERT_ROWS',
            'values': [
              ['Data', 123.45, true, '=MAX(D2:D4)', '10']
            ]
          }
          window.gapi.client.sheets.spreadsheets.values.append(params).then(function (response) {
            // TODO: Change code below to process the `response` object:
            console.log('update response ', response.result)
          }, function (reason) {
            console.error('error: ' + reason.result.error.message)
          })
        })
      },
      start2: function () {
        // Initializes the client with the API key and the Translate API.
        window.gapi.client.init({
          'apiKey': 'AIzaSyAAnXxFOq4sRi5f0uJhTPYZtwmY011CcH8',
          'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
          'clientId': '740243268480-ukalbakddeujd2m2svde17c6prhdfmqf.apps.googleusercontent.com',
          'scope': 'https://www.googleapis.com/auth/drive'
        }).then(function () {
          window.gapi.client.sheets.spreadsheets.create({
            'resource': {}
          })
            .then(function (response) {
              // Handle the results here (response.result has the parsed body).
              console.log('create Response', response)
            }, function (error) {
              console.error('create Execute error', error)
            })
        })
      },
      execute: function () {
        return window.gapi.client.sheets.spreadsheets.create({
          'resource': {}
        })
          .then(function (response) {
            // Handle the results here (response.result has the parsed body).
            console.log('create Response', response)
          }, function (error) {
            console.error('create Execute error', error)
          })
      },
      initClient: function () { // dont think i need this anymore
        window.gapi.auth2.init({
          'apiKey': 'AIzaSyAAnXxFOq4sRi5f0uJhTPYZtwmY011CcH8',
          'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
          'clientId': '740243268480-ukalbakddeujd2m2svde17c6prhdfmqf.apps.googleusercontent.com',
          'scope': 'https://www.googleapis.com/auth/drive'
        }).then(function () {
          // Listen for sign-in state changes.
          window.gapi.client.sheets.spreadsheets.values.append({}).then(function (response) {
            // TODO: Change code below to process the `response` object:
            console.log(response.result)
          }, function (reason) {
            console.error('error: ' + reason.result.error.message)
          })
          console.log('google auth init: ', window.gapi.auth2.getAuthInstance().isSignedIn.get())
        }, function (response) {
          console.log('Error: ' + response.result.error.message)
        })
      },
      /**
       *  player  methods
       */
      ready (player) {
        this.player = player
      },
      playing (player) {
        // The player is playing a video.
        console.log('playing.............')
      },
      change () {
        // when you change the value, the player will also change.
        // If you would like to change `playerVars`, please change it before you change `videoId`.
        // If `playerVars.autoplay` is 1, `loadVideoById` will be called.
        // If `playerVars.autoplay` is 0, `cueVideoById` will be called.
        this.videoId = 'vcn2ruTOwFo'
      },
      stop () {
        this.player.stopVideo()
      },
      pause () {
        this.player.pauseVideo()
      }
    },
    mounted () {
      // this.sheet()
      console.log('authenticated?  ', this.isAuthenticated())
      if (window.gapi) {
        window.gapi.load('client', this.videos)
        // window.gapi.load('auth2', this.initClient)
        // this.start()
      }
    }
  }
</script>
