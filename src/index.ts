import express, { Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import { Setup } from '@bsv/wallet-toolbox'
import { createPaymentMiddleware } from '@bsv/payment-express-middleware'
import { createAuthMiddleware } from '@bsv/auth-express-middleware'

import * as crypto from 'crypto'
(global.self as any) = { crypto }

// NOTE: ONLY FOR DEMO, USE .ENV TO SECURE PROD ENVIRONMENT VARIABLES! ---------------------------------------------
const SERVER_PRIVATE_KEY = 'f9b0f65b26f7adfc70d3819491b42506c07d8f150c55a1eb31efe3b4997edba3'
const WALLET_STORAGE_URL = 'https://storage.babbage.systems'
const HTTP_PORT = 3000

// Define Authenticated Request Type
interface AuthenticatedRequest extends Request {
  auth?: { identityKey: string }
}

const app = express()
app.use(bodyParser.json())

// This middleware sets CORS headers.
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Expose-Headers', '*')
  res.header('Access-Control-Allow-Private-Network', 'true')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

// Serve static files from the 'public' directory.
app.use(express.static('public'))

const wallet = await Setup.createWalletClientNoEnv({
  chain: 'main',
  rootKeyHex: SERVER_PRIVATE_KEY,
  storageUrl: WALLET_STORAGE_URL
})

// Setup the authentication middleware.
app.use(createAuthMiddleware({
  wallet,
  allowUnauthenticated: false,
  logger: console,
  logLevel: 'debug'
})
)

// Setup the payment middleware.
app.use(createPaymentMiddleware({
  wallet,
  calculateRequestPrice: async (req) => {
    return 1 // 1 sat flat rate fee
  }
}))

// Define the /weatherStats endpoint.
app.get('/weatherStats', async (req: AuthenticatedRequest, res: Response) => {
  const responseData = await fetch(
    'https://openweathermap.org/data/2.5/weather?id=5746545&appid=439d4b804bc8187953eb36d2a8c26a02',
    { method: 'GET' }
  ).then((response) => response.json())
  res.json(responseData)
})

// Start the server.
app.listen(HTTP_PORT, () => {
  console.log('Monetized Weather API Wrapper listening on port', HTTP_PORT)
})
