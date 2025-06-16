// app.js
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const postRoutes = require("./src/routes/post.route")
const userRoutes = require("./src/routes/user.routes")
require('dotenv').config()
const swaggerUI = require('swagger-ui-express')
const specs = require("./swagger")
const cors = require('cors')
const passport = require('passport')
require("./src/middleware/passport")

app.use(cors({}))
app.use(express.json())
app.use(passport.initialize())


// API Documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));


// Routes
app.use('/api', [userRoutes, postRoutes]);

// Database Connection
mongoose.connect(process.env.MongoURI)
    .then(() => console.log('Database Connected!'))
    .catch((error) => console.log(error));

module.exports = app;
