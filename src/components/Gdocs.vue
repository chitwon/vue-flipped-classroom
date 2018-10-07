<template>
  <div>
    <v-container fluid="fluid" class="text-xs-center">
      <v-layout row wrap>
        <v-flex >
          <h1>Class Documents</h1>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex >
          <div>
            <v-btn large color="teal lighten-2" dark @click="refresherDialog = true">Refresher Math</v-btn>
            <v-btn large color="teal lighten-2" dark @click="intensiveDialog = true">Intensive Math</v-btn>
          </div>
        </v-flex>
      </v-layout>

      <v-layout row wrap v-if="page">
        <v-flex xs12>
          <a v-bind:href="sharedLink" target="_blank" > link to doc on google drive </a>
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex xs12>
          <div v-if="page">
            <iframe width="800" height="800" :src="page" frameborder="2" v-if="showPage" ></iframe>
          </div>
        </v-flex>
      </v-layout>

    </v-container>

    <v-dialog v-model="refresherDialog" persistent absolute>
      <v-card>
        <v-card-title>
          <div class="headline">Refresher Math </div>
        </v-card-title>

        <Spinner v-if="!foundRefresher"></Spinner>

        <div v-else>
          <v-list>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="green--text darken-1" flat="flat" @click.native="refresherDialog = false">Close</v-btn>
            </v-card-actions>
            <v-list-tile v-for="(sel, i) in select" :key="i" @click="">
              <v-layout row @click="change(sel.name, sel.publish, sel.share)">
                <v-list-tile-title>{{ sel.name }}</v-list-tile-title>
                <v-divider></v-divider>
                <v-list-tile-sub-title v-html="'Complete by ' + (sel.date ? sel.date : 'NOT SET') "></v-list-tile-sub-title>
                <v-divider></v-divider>
              </v-layout>
            </v-list-tile>
          </v-list>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="green--text darken-1" flat="flat" @click.native="refresherDialog = false">Close</v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="intensiveDialog" persistent absolute>
      <v-card>
        <v-card-title>
          <div class="headline">Intensive Math Videos</div>
        </v-card-title>
        <Spinner v-if="foundIntensive"></Spinner>
        <v-card-text v-else>Currently there are no intensive math documents </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="green--text darken-1" flat="flat" @click.native="intensiveDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>


<script>
  export default {
    name: 'Gdocs',
    data () {
      return {
        showPage: true,
        refresherDialog: false,
        intensiveDialog: false,
        select: null,
        foundIntensive: false,
        foundRefresher: false,
        page: null,
        sharedLink: null
      }
    },
    methods: {
      change: function (name, link, share) {
        this.page = link
        this.refresherDialog = false
        this.sharedLink = share
        this.insertIntoDocSheet('load doc', name, share)
      },
      refresherDocs: function () {
        console.log('docs')
        let self = this
        window.gapi.client.init({
          'apiKey': this.$store.getters.googleApiKey,
          'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4']
        }).then(function () {
          // to do
          window.gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_LIST_SHEET_ID,
            range: process.env.GOOGLE_LIST_DOC_SHEET_RANGE
          }).then(function (response) {
            let docArray = response.result.values
            // set the indexes of video, url, and level
            // ---
            let i = 0
            let nameIndex = null
            let shareIndex = null
            let publishIndex = null
            let dateIndex = null
            let docList = []
            docArray.forEach(function (row) {
              if (i === 0) {
                // console.log('0 elelment', typeof row)
                for (var key in row) {
                  console.log(key, row[key])
                  if (row[key] === 'Name') {
                    nameIndex = key
                  }
                  if (row[key] === 'drive share link') {
                    shareIndex = key
                  }
                  if (row[key] === 'drive publish link') {
                    publishIndex = key
                  }
                  if (row[key] === 'due date') {
                    dateIndex = key
                  }
                }
                i++
              } else {
                docList.push({name: row[nameIndex], share: row[shareIndex], publish: row[publishIndex], date: row[dateIndex]})
              }
              // console.log('doc list:', docList)
              self.select = docList
              self.foundRefresher = true
              // self.page = row[publishIndex]
            })
          }, function (response) {
            console.log('Error: ' + response.result.error.message)
          })
        }, function (response) {
          console.log('vidoe list Error: ' + response.result.error.message)
        })
      },
      insertIntoDocSheet: function (event, docTitle, docLink) {
        // Initializes the client with the API key and the Translate API.
        if (!this.$auth.isAuthenticated()) return null
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
            'range': process.env.GOOGLE_DOC_SHEET_RANGE,
            'majorDimension': 'ROWS',
            // How the input data should be interpreted.
            'valueInputOption': 'USER_ENTERED',
            'insertDataOption': 'INSERT_ROWS',
            'values': [
              [event, docTitle, docLink, d.toLocaleString(), Date.now()]
            ]
          }
          window.gapi.client.sheets.spreadsheets.values.append(params).then(function (response) {
            // TODO: Change code below to process the `response` object:
            console.log('update response ', response.result)
          }, function (reason) {
            console.error('error: ' + reason.result.error.message)
          })
        })
      }
    },
    mounted () {
      // this.sheet()
      console.log('API: ', process.env.GOOGLE_REDIRECT)
      if (window.gapi) {
        window.gapi.load('client', this.refresherDocs)
        // window.gapi.load('auth2', this.initClient)
        // this.start()
      }
    }
  }
</script>
