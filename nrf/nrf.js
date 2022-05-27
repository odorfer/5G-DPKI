const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Config
app.use(bodyParser.json())
const port = 3002;

// Contains list of NF instances
const searchResults = {
    "validityPeriod":0,
    "nfInstances":[
       {
          "nfInstanceId":"3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "nfInstanceName":"string",
          "nfType":"UDM",
          "nfStatus":"REGISTERED",
          "nfServiceList":{
             "a123":{
                "serviceInstanceId":"a123",
                "serviceName":"nnrf-disc",
                "versions":{
                   "apiVersionInUri":"v1",
                   "apiFullVersion":"1.0.0"
                },
                "scheme":"http",
                "nfServiceStatus":"REGISTERED",
                "ipEndPoints":[
                   {
                      "ipv4Address":"127.0.0.1",
                      "transport":"tcp",
                      "port":3001
                   }
                ],
                "did":"HMX5QUJH5tozxrZ7FJrXvv"
             }
          }
       }
    ]
 }

// NRF NFDiscovery Service
app.get('/nnrf-disc/v1/nf-instances', (req, res) => {
  res.set({'Cache-Control': 'public, max-age=1000'})
  res.json(searchResults)
  }
);

app.listen(port, () => console.log(`NRF listening on port ${port}!`));