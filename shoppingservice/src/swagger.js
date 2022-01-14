const express = require('express')
const process = require('process')

const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

const app = express()

const PORT = process.env.PORT || 8080

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

app.listen(PORT, console.log.bind(null, "Listening on", PORT))