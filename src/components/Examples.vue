<template>
  <div>
    <v-container grid-list-md text-xs-center>
      <v-layout row >
        <v-flex xs12>
          <v-card dark color="primary" @click.native="refresherDialog = true"    >
            <v-card-text class="p-4"  > Refresher Math Examples   </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <v-dialog v-model="refresherDialog"  persistent absolute text-xs-center>
      <v-container grid-list-md text-xs-center>
        <Spinner v-if="!foundRefresher"></Spinner>

        <v-card v-else text-xs-center>
          <v-card-title >
            <div class="headline"> Refresher Math Problem Examples  </div>
          </v-card-title>
          <v-btn class="green--text darken-1" flat="flat" @click.native="refresherDialog = false">Close</v-btn>
          <v-flex   xs12  class="p-4" >
            <v-layout row wrap text-xs-center>
              <v-flex  md3 xs12 v-for="(l,i) in list"  :key="i" text-xs-center>
                <v-card dark color="primary" v-if="l.mof == 'midterm'">
                  <v-card-text class="px-0"  @click="change(l.name, l.link, l.type, l.share)">{{ l.name }}  </v-card-text>
                </v-card>
                <v-card dark color="error" v-else>
                  <v-card-text class="px-0"  @click="change(l.name, l.link, l.type)">{{ l.name  }}  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-btn class="green--text darken-1" flat="flat" @click.native="refresherDialog = false">Close</v-btn>
        </v-card>

      </v-container>
    </v-dialog>

    <v-layout row wrap v-if="page">
      <v-flex xs12>
        <a v-bind:href="page" target="_blank" > link to doc on google drive </a>
      </v-flex>
    </v-layout>

    <iframe  v-if="doc" :src="link"  width="640" height="480"></iframe>
  </div>
</template>


<script>
  export default {
    name: 'Gdocs',
    data () {
      return {
        page: null,
        refresherDialog: false,
        doc: null,
        list: [],
        foundRefresher: false
      }
    },
    methods: {
      refresherExamples: function () {
        console.log('example')
        let self = this
        window.gapi.client.init({
          'apiKey': this.$store.getters.googleApiKey,
          'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4']
        }).then(function () {
          // to do
          window.gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_LIST_SHEET_ID,
            range: process.env.GOOGLE_LIST_EXAMPLE_SHEET_RANGE
          }).then(function (response) {
            let docArray = response.result.values
            // set the indexes of video, url, and level
            // ---
            let i = 0
            let nameIndex = null
            let MofIndex = null
            let link = null
            let shareIndex = null
            let embedIndex = null
            let typeIndex = null
            let docList = []
            docArray.forEach(function (row) {
              if (i === 0) {
                // console.log('0 elelment', typeof row)
                for (var key in row) {
                  console.log(key, row[key])
                  if (row[key] === 'Name') {
                    nameIndex = key
                  }
                  if (row[key] === 'Share Link') {
                    shareIndex = key
                  }
                  if (row[key] === 'Embed Link') {
                    embedIndex = key
                  }
                  if (row[key] === 'MOF') {
                    MofIndex = key
                  }
                  if (row[key] === 'type') {
                    typeIndex = key
                  }
                }
                i++
              } else {
                // need to know if document is pdf or google doc to use either share or embed
                link = row[shareIndex]
                if (row[typeIndex] === 'doc') {
                  link = row[embedIndex]
                }
                docList.push({name: row[nameIndex], link: link, mof: row[MofIndex], type: row[typeIndex], share: row[shareIndex]})
              }
              console.log('doc list:', docList)
              self.list = docList
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
        if (!this.$auth.isAuthenticated()) return null
        // Initializes the client with the API key and the Translate API.
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
            'range': process.env.GOOGLE_EXAMPLE_SHEET_RANGE,
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
      },
      change: function (name, doc, type, share) {
        this.page = null
        this.link = doc
        if (type === 'doc') {
          this.page = share
        }
        this.doc = doc
        this.insertIntoDocSheet('load example', name, this.link)
        this.refresherDialog = false
        console.log(this.link)
      }
    },
    mounted () {
      console.log('API: ', process.env.GOOGLE_REDIRECT)
      if (window.gapi) {
        window.gapi.load('client', this.refresherExamples)
      }
    }
  }
  /*
   https://docs.google.com/document/d/1FKiqsopFpNptbTG8oDThJn4X21av3heDtbPHS1NRo9w/edit?usp=sharing
   https://docs.google.com/document/d/e/2PACX-1vSuwkZiN_zO__f0qoJH0Oim8wL7BEYaUzTGvy57B31d1yek2x4PC7zuSryi3CnOQvrhASb0Pe_ClwW-/pub
   */
</script>
