const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid')

// Setup express framework
const app = express()
app.use(bodyParser.json())

// Events
var events = require('events')
var eventEmitter = new events.EventEmitter()

// DIDComm Configuration
const agentURL = "http://localhost:11000"
const nrfDID = "JNssMCYPJjwxzmPAY2b23x"
const nrfURL = "http://localhost:3002"

// DIDComm connection state
let nrfConnectionId = ""

// NF service instances
let serviceInstances = {}

// Messages DHT
const messages = new Map()

// Initialize DIDComm connection to NRF
setupDIDCommConnection(nrfDID).then(data => {nrfConnectionId = data})

// Create connection to a specified DID and its agent via DID Exchange Protocol
function setupDIDCommConnection(communicationPartnerDID) {
  let url = `${agentURL}/didexchange/create-request?their_public_did=${communicationPartnerDID}&use_public_did=true`
  return axios.post(url)
    .then(response => {
      let connectionId = response.data.connection_id
      console.log(`Successfully created new DIDComm connection: ${connectionId}`)
      return connectionId
    }, (error) => {
      console.log(`Error during connection setup: ${error}`)
    })
}

// Contacts NRF for list of all available NF services
function nrfServiceLookup (nrfConnectionId) {
  console.log(`test ${nrfConnectionId}`)
  let correlationId = uuidv4()
  let body = JSON.stringify({ "correlation_id": correlationId, "url": nrfURL + '/nnrf-disc/v1/nf-instances', "method": "GET" })
  let url = agentURL + "/connections/" + nrfConnectionId + "/send-message"
  return axios.post(url, {
      content: body
    })
    .then((response) => {
      return correlationId
    }, (error) => {
      console.log("Error during NRF lookup")
      //console.log(error);
    });
}

// Translate HTTP requests to DIDComm messages
function HTTPtoDIDComm(httpRequest, connectionId) {
  let correlationId = uuidv4()
  let body = JSON.stringify({ "correlation_id": correlationId, "url": httpRequest.url, "method": httpRequest.method, "header": httpRequest.headers, "body": httpRequest.body })
  let url = agentURL + "/connections/" + connectionId + "/send-message"
  return axios.post(url, {
    content: body
  })
    .then((response) => {
      return correlationId
    }, (error) => {
      console.log(error)
    })
}

app.post('/webhooks/topic/basicmessages', function(req, res) {
  console.log(req.body)
    let correlationId = JSON.parse(req.body.content).correlation_id
    console.log(typeof correlationId)
    console.log(correlationId)
    messages[correlationId] = JSON.parse(req.body.content) 
    eventEmitter.emit(correlationId)
    res.status(200).end()
})

// Log webhook events
app.post('/webhooks/*', function(req, res) {
  //console.log(req.body)
  res.status(200).end()
})

app.get('*', (req, res) => {

  nrfServiceLookup(nrfConnectionId).then(correlationId => {
    // Wait for webhook event, which includes the NRF lookup response
    eventEmitter.once(correlationId, () => {
      console.log("newMessage event called")
      //response.status(200).end()
      console.log(messages[correlationId].body.nfInstances[0].nfServiceList.a123.did)

      // Store NRF lookup result locally
      serviceInstances = messages[correlationId].body

      // Extract the desired DID from the result list. In this case there's only one service included, the UDM service.
      let targetDID = serviceInstances.nfInstances[0].nfServiceList['a123'].did

      // Open connection to UDM Agent
      setupDIDCommConnection(targetDID).then(connectionId => {
        console.log(`connectionId ${connectionId}`)
        // Translate HTTP request to DIDComm request
        setTimeout(() => {
          HTTPtoDIDComm(req, connectionId).then(correlationId => {
            // Wait for webhook event, which includes the UDM response
            eventEmitter.once(correlationId, () => {
              // Send the UDM response back to AMF
              res.send(messages[correlationId])
              return
            })
            
          }) 
      }, 9000)
        
      })

    })
  })
})

// DID Management

// Get current public DID of agent
/*let urlArg = agentURL + '/wallet/did/public'

axios.get(urlArg)
.then((response) => {
  console.log(response.data);
});

// List all DIDs of wallet
let urlArg = agentURL + '/wallet/did'

axios.get(urlArg)
.then((response) => {
  console.log(response.data);
}); 

// Get DID document associated with the DID of the AMF agent
let urlArg = agentURL + '/resolver/resolve/' + 'did:sov:9zFGiRAvXHarfJjp1FEAnf'

axios.get(urlArg)
.then((response) => {
  console.log(response.data);
}); */

app.listen(4000)
