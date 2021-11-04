import express from 'express'
import process from 'process'
import bodyParser from 'body-parser'
import { AddressInfo } from 'net'

const app = express()

app.use((req, res, next) => {
  // set the CORS policy and CORS headers
  res.header('Access-Control-Allow-Origin', '*')
     .header('Access-Control-Allow-Headers', 'origin, X-Requested-With, Content-Type, Accept, Authorization')

  // set the CORS method headers
  if (req.method === 'OPTIONS') return res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST').status(200).json({})

  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/:path', (req, res) => {

})

app.post('/:path', (req, res) => {
  
})

const server = app.listen(process.env.PORT || 80, () => {
  const addr = server.address() as AddressInfo
  console.log(`Server is running at http://localhost:${ addr.port }`)
});
