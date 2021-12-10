const express = require('express')

const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

const app = express()

const options = {
definition: {
    openapi: "3.0.0",
    info: {
        title: "Shopping API",
        version: "1.0.0",
        description: "A simple Express Shopping API",
        }
    },
    apis: ["./src/routes/*.js"],
}

const specs = swaggerJsDoc(options)
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

app.listen(8080, console.log.bind(null, "Listening on 8080"))