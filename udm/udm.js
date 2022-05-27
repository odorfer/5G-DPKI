const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// Config
app.use(bodyParser.json())
const port = 3001;

const exampleSmsSubscriptionData = {
  'smsSubscribed': true,
  'sharedSmsSubsDataId': '12345-A'
}

// SMS Subscription Data Retrieval
app.get('/nudm-sdm/v2/:supi/sms-data', (req, res) => {
  res.set({
    'Cache-Control': 'public, max-age=1000',
    'Last-Modified': (new Date()).toUTCString()
  })
  res.json(exampleSmsSubscriptionData)
  }
)

app.listen(port, () => console.log(`UDM listening on port ${port}!`))