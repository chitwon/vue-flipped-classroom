<template>
  <v-container>

    <v-dialog v-model="refresherDialog" persistent absolute>
      <v-card>
        <v-card-title>
          <div class="headline">Refresher Math Vidoes</div>
        </v-card-title>

        <Spinner v-if="!foundRefresherVideos"></Spinner>

        <v-list>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="green--text darken-1" flat="flat" @click.native="refresherDialog = false">Close</v-btn>
          </v-card-actions>
          <v-list-tile v-for="(sel, i) in select" :key="i" @click="">
            <v-layout row @click="change(sel.url)">
              <v-list-tile-title>{{ sel.text }}</v-list-tile-title>
              <v-divider></v-divider>
              <v-list-tile-sub-title v-html="'watch by ' + sel.date"></v-list-tile-sub-title>
              <v-divider></v-divider>
            </v-layout>
          </v-list-tile>
        </v-list>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="green--text darken-1" flat="flat" @click.native="refresherDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="intensiveDialog" persistent absolute>
      <v-card>
        <v-card-title>
          <div class="headline">Intensive Math Videos</div>
        </v-card-title>
        <Spinner v-if="!foundVideos"></Spinner>
        <v-card-text v-else>Action</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="green--text darken-1" flat="flat" @click.native="intensiveDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-layout row wrap align-center >
      <v-flex xs12 md3>
        <v-card>
          <v-toolbar color="teal lighten-3" dark @click="refresherDialog = true">
            <v-toolbar-title>Refresher Math </v-toolbar-title>
          </v-toolbar>
        </v-card>
      </v-flex>
      <v-flex xs1></v-flex>
      <v-flex xs12 sm10 md3 >
        <v-card>
          <v-toolbar color="teal lighten-3" dark @click="intensiveDialog = true">
            <v-toolbar-title>Intensive Math</v-toolbar-title>

          </v-toolbar>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap align-center >
      <div id="videos" class="mt-2">
        <youtube :video-id="videoId" @ready="ready" @playing="playing" @paused="paused"  @ended="ended" v-if="videoId"></youtube>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        refresherDialog: false,
        intensiveDialog: false,
        foundVideos: false,
        foundRefresherVideos: false,
        select: null,
        videoId: null,
        userSheet: null,
        isLoggedIn: this.$auth.isAuthenticated()
      }
    },
    methods: {
      refresherVideos: function () {
        // get the videos from a google sheet shared to public,
        // to do --- set video id in configure
        let self = this
        window.gapi.client.init({
          'apiKey': this.$store.getters.googleApiKey,
          'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4']
        }).then(function () {
          // to do
          window.gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_LIST_SHEET_ID,
            range: process.env.GOOGLE_LIST_VIDEO_SHEET_RANGE
          }).then(function (response) {
            let videoArray = response.result.values
            // set the indexes of video, url, and level
            // ---
            let i = 0
            let videoIndex = null
            let urlIndex = null
            let levelIndex = null
            let dateIndex = null
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
                  if (row[key] === 'due date') {
                    dateIndex = key
                  }
                }
                i++
              } else {
                videoList.push({text: row[videoIndex], url: row[urlIndex], date: row[dateIndex]})
                self.videoId = row[urlIndex]
              }
              console.log('video list:', videoList)
              self.select = videoList
              self.foundRefresherVideos = true
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
      insertIntoVideoSheet: function (event, videoId) {
        // Initializes the client with the API key and the Translate API.
        if (!this.isLoggedIn) return null
        let self = this
        window.gapi.client.init({
          'apiKey': process.env.GOOGLE_API_KEY,
          'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
          'clientId': process.env.GOOGLE_CLIENT_ID,
          'scope': 'https://www.googleapis.com/auth/drive'
        }).then(function () {
          // Executes an API request, and returns a Promise.
          // The method name `language.translations.list` comes from the API discovery.
          console.log('google is auth?: ', window.gapi.auth2.getAuthInstance().isSignedIn.get())
          // console.log('compare: 1-OPXUJkSpDLjuNHZ0m6jTt-09YzAtBi7vMXWSQ5RT7E', self.$store.getters.userSheet )
          let d = new Date()
          const params = {
            'spreadsheetId': self.$store.getters.userSheet,
            'range': process.env.GOOGLE_VIDEO_SHEET_RANGE,
            'majorDimension': 'ROWS',
            // How the input data should be interpreted.
            'valueInputOption': 'USER_ENTERED',
            'insertDataOption': 'INSERT_ROWS',
            'values': [
              [event, videoId, self.player.getCurrentTime(), d.toLocaleString(), Date.now(), self.player.getVideoData().title, self.player.getVideoData().author]
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
      /**
       *  player  methods
       */
      ready (player) {
        this.player = player
        console.log('player: ', player)
      },
      playing (player) {
        // The player is playing a video.
        this.insertIntoVideoSheet('video start: ' + this.player.getPlayerState(), this.videoId)
        console.log('playing.............', player.getVideoData())
      },
      paused (player) {
        // The player is playing a video.
        this.insertIntoVideoSheet('video pause: ' + this.player.getPlayerState(), this.videoId)
        console.log('paused.............', player.getPlayerState())
      },
      ended (player) {
        // The player is playing a video.
        this.insertIntoVideoSheet('video end: ' + this.player.getPlayerState(), this.videoId)
        console.log('end.............', player.getPlayerState())
      },
      change (ulr) {
        // when you change the value, the player will also change.
        // If you would like to change `playerVars`, please change it before you change `videoId`.
        // If `playerVars.autoplay` is 1, `loadVideoById` will be called.
        // If `playerVars.autoplay` is 0, `cueVideoById` will be called.
        this.insertIntoVideoSheet('video change: ' + this.player.getPlayerState(), this.videoId)
        this.videoId = ulr
        this.refresherDialog = false
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
      console.log('API: ', process.env.GOOGLE_REDIRECT)
      if (window.gapi) {
        window.gapi.load('client', this.refresherVideos)
        // window.gapi.load('auth2', this.initClient)
        // this.start()
      }
    }
  }
</script>
