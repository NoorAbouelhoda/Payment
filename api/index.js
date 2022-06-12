const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')



// require('dotenv').config()


const stripe = require('stripe')('sk_test_51L4RuPIg7OYMXGQ3A5WCbE3ri0MhRH0hw2Q75yjKiCyGfQkEAywyzOl3SwDHd4A6i2TKe9a43klBXPSN8GqJHjxM00ruJaeOA2')

const app = express()
const router = express.Router()
const port = process.env.PORT || 7000

router.all('*', (_, res) =>
  res.json({ message: 'please make a POST request to /stripe/charge' })
)
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})
app.use(bodyParser.json())
// // app.use('/api', router)
app.use(express.static(path.join(__dirname, '../build')))
// app.get('/', async function (req,res){
//   //res.sendFile(path.resolve(__dirname, './../build/index.html'))
//   res.send("Hello Noor")
// })
app.post('/api/stripe/charge', async function postCharge(req, res) {
  try {
    const { amount, source, receipt_email } = req.body
    // console.log(amount, source,  receipt_email);
    const charge = await stripe.charges.create({
      amount,
      currency: 'USD',
      source,
      receipt_email
    })

    if (!charge) throw new Error('charge unsuccessful')

    res.status(200).json({
      charge,
      message: 'charge posted successfully'
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
})


// module.exports = postCharge

app.listen(port, () => console.log(`server running on port ${port}`))