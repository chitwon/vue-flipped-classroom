'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  GOOGLE_REDIRECT: '"http://localhost:8080/callback"',
  API_CALLBACK: '"http://localhost/vue-api/callback.php"'
})
