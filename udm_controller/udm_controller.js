const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

const app = express()
app.use(bodyParser.json())

// DIDComm Configuration
const agentURL = "http://localhost:11001"

// Receive incoming DIDComm messages
app.post('/webhooks/topic/basicmessages', function(req, res) {
    console.log("New message at UDM controller")
    //console.log(req.body)
    let url = JSON.parse(req.body.content).url
    let sourceConnectionId = req.body.connection_id
    let correlationId = JSON.parse(req.body.content).correlation_id

    // Get data from UDM
    axios.get(url)
    .then(res => {
        console.log('Status Code:', res.status)
        console.log('Status UDM response:', res.data)

        axios.post(agentURL + '/connections/' + sourceConnectionId + '/send-message', {
            content: JSON.stringify({"correlation_id": correlationId, "body": res.data})
        })
        .then((response) => {
            console.log("Sent UDM response message back to controller")
        })
        }, (error) => {
            console.log(error)
        })
    .catch(err => {
        console.log('Error: ', err.message)
    });
    
  res.status(200).end()
})

// Log other webhook events, if necessary
app.post('/webhooks/*', function(req, res) {
    //console.log(req.body)
    res.status(200).end()
})

app.listen(4001)