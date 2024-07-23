const express = require('express')
const app = express()
const mongoose = require('mongoose')
const postRouter = require('./routes/post.route')
require('dotenv').config()
const swaggerUI = require('swagger-ui-express')
const specs = require('./swagger')

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))
app.use('/api/posts', postRouter)
app.use(express.json())


const PORT = 3000||process.env.PORT
app.listen(PORT, ()=>{
    console.log(`App running on post ${PORT}`)
})

mongoose.connect(process.env.MongoURI)
    .then(() => console.log('Database Connected!'))
    .catch((error)=>console.log(error))