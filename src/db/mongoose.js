// conecting to the database
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URL)