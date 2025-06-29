const express = require('express')
const cors = require('cors')
const  app = express()
app.use(express.json())
require ("dotenv").config()
const mongoose = require ('mongoose')
const userRouter = require('./Router/userRouter')
const accountRouter = require('./Router/accountRouter')
const expenseRouter = require('./Router/expenseRouter')
const goalRouter = require('./Router/goalRouter')

const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URL

app.use(cors())


app.use('/api',userRouter)
app.use('/api/account',accountRouter)
app.use('/api/expense',expenseRouter)
app.use('/api/goal',goalRouter)



mongoose .connect(MONGO_URL)
.then(()=>{
    console.log('the database is connected')
})
.catch((err)=>{
    console.log(err)
})


app.listen(PORT,(req,res)=>{
    console.log(`the port is connected ${PORT}`)
})