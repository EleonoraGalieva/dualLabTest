const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/user')
// middleware to validate a user with provided token
const auth = async function (req, res, next) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decodedInfo = jsonwebtoken.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decodedInfo._id, 'token': token })
        if (!user) {
            throw new Error()
        }
        // new token is generated, so new 30 minutes can start again
        // await user.generateToken()
        req.user = user
        next()
    } catch (error) {
        res.status(400).send('Please sign in.')
    }
}

module.exports = auth