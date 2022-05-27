const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const axios = require('axios')

// Config
app.use(bodyParser.json())
const port = 3000

const controllerHost = 'localhost'
const controllerPort = 4000

const udmHost = 'localhost'
const udmPort = 3001

// Define Subscription Permanent Identifier (SUPI) for request to UDM
const supi = '310 240 974564247'

// Get data from UDM after 10 seconds
setTimeout(function(){
  axios.get(`http://${udmHost}:${udmPort}/nudm-sdm/v2/${supi}/sms-data`, {
    proxy: {
        host: controllerHost,
        port: controllerPort
    }
  })
  .then(res => {
    console.log('Request sent to UDM')
    console.log('Status Code:', res.status)
    console.log('Response from UDM:', res.data)

  })
  .catch(err => {
    console.log('Error: ', err.message)
  })
}, 10000)

app.listen(port, () => console.log(`AMF listening on port ${port}!`))