const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

// creating a user schema with all needed fields
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Please, enter a propper email.')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Age can not be negative.')
            }
        }
    },
    image: {
        type: Buffer
    },
    token: {
        type: String
    }
})

// overriding this toJSON method, so there is no sensitive info send back to 
// the client
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.token
    return userObject
}

// generating a token with jsonwebtoken
userSchema.methods.generateToken = async function () {
    const user = this
    const token = jsonwebtoken.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '30m' })
    user.token = token
    await user.save()
    return token
}

// saving password in the encrypted form in order to protect information
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// sign in method
// first, finding a user by the name(unique)
// then, checking the password
userSchema.statics.signIn = async (name, password) => {
    const user = await User.findOne({ name })
    if (!user) {
        throw new Error('Unable to login.')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login.')
    }
    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User