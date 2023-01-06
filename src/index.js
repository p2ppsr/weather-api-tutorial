const express = require('express')
const fetch = require('isomorphic-fetch')
const bodyparser = require('body-parser')
const PacketPay = require('@packetpay/express')
const authrite = require('authrite-express')
const { preAuthrite } = require('./routes') // used to prevent Authrite error
const SERVER_PRIVATE_KEY = 'f9b0f65b26f7adfc70d3819491b42506c07d8f150c55a1eb31efe3b4997edba3'
const HOSTING_DOMAIN = 'http://localhost:3000'
const HTTP_PORT = 3000
const ROUTING_PREFIX = ''

const app = express()
app.use(bodyparser.json())

// This allows the API to be used when CORS is enforced
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Expose-Headers', '*')
  res.header('Access-Control-Allow-Private-Network', 'true')
  if (req.method === 'OPTIONS') {
    res.send(200)
  } else {
    next()
  }
})

// A preAuthrite dummy route (see /routes/dummy.js) is used here to prevent an Authrite browser error being raised in the JS console
app.use(express.static('public'))
preAuthrite.forEach((route) => {
  if (route.path !== 'data') {
    app[route.type](`${ROUTING_PREFIX}${route.path}`, route.func)
  }
})

// Authrite is enforced from here forward
app.use(authrite.middleware({
  serverPrivateKey: SERVER_PRIVATE_KEY,
  baseUrl: HOSTING_DOMAIN
}))

app.use(PacketPay({
  serverPrivateKey: SERVER_PRIVATE_KEY,
  ninjaConfig: {
    // Use the Babbage staging testnet Dojo
    dojoURL: 'https://staging-dojo.babbage.systems'
  },
  calculateRequestPrice: req => {
    return 333
  }
}))

app.post('/weatherStats', async (req, res) => {
  console.log(`Received ${req.packetpay.satoshisPaid} satoshis!`)
  const response = await fetch(
    'https://openweathermap.org/data/2.5/weather?id=5746545&appid=439d4b804bc8187953eb36d2a8c26a02', { method: 'GET' }).then(
    response => response.json()
  )
  res.json(response)
})

app.listen(HTTP_PORT, () => {
  console.log('PacketPay Weather API Wrapper listening on port', HTTP_PORT)
})
