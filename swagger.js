const swaggerJSDoc = require('swagger-jsdoc')

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title : "News blog Api",
        version : '1.0.0'
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Local server'
        },
        {
            url: 'https://news-blog-92em.onrender.com',
            description: 'Production server'
        }
    ]
}

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
}

const specs = swaggerJSDoc(options)
module.exports = specs