const express = require('express')
require('./db/mongoose')
const cors = require('cors')
const userRouter = require('./routers/user')

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(userRouter)

app.listen(port, () => {
    console.log('The server is running on port: ' + port)
})