const app = require('./src/config/express')
const connectTomongodb = require('./src/config/mongodb')
const {PORT} =require("./src/config/secrets")
const port = PORT || 8081

app.listen((PORT), () => {
    console.log(`Server Started
    
    Host: http://localhost:${PORT}`)
    connectTomongodb()
})