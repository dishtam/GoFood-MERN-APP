const express = require('express')
const app = express()
const port =  5000
const mongoDB = require('./db')

mongoDB()

// Code to solve the CORS error
// It must be written exactly the same way
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header(
    'Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  next()
})
 
// app.use is a middleware that is used to make a route, the route is made
// in the Routes  folder and and once "/api" is hit "CreateUser.js" file
// is called and that function is executed
app.use(express.json())

app.use('/api', require('./Routes/CreateUser'))
app.use('/api', require('./Routes/DisplayData'))
app.use('/api', require('./Routes/OrderData')) 
app.get('/', (req, res) => {
  res.send('Hello World!') 
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`) 
})
