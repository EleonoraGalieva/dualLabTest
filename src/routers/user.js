// This is a file for all the routers
const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const upload = require('../middleware/upload')
const router = express.Router()

// Crating a user (Register)
router.post('/api/user', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user._id)
    } catch (error) {
        res.status(400).send(error)
    }
})

// Sign In
router.post('/signin', async (req, res) => {
    try {
        const user = await User.signIn(req.body.name, req.body.password)
        // forming the token
        const token = await user.generateToken()
        res.send(token)
    } catch (error) {
        res.status(404).send(error)
    }
})

// Read user info by id, only allowed for sign in users 
router.get('/api/user/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(404).send(error)
    }
})

// Update user info by id, only allowed for sign in users
router.patch('/api/user/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        // get the previous user info
        const userBeforeUpdates = await User.findById(_id)
        // creating a list of fields possible to update
        // in order for client not to be able to update
        // some important fields like token or _id
        const updates = Object.keys(req.body)
        const possibleUpadates = ['name', 'email', 'password', 'gender', 'age']
        const isUpdatePossible = updates.every((update) => {
            return possibleUpadates.includes(update)
        })
        if (!isUpdatePossible) {
            return res.status(400).send({ error: 'Sorry, updating this field is not possible.' })
        }
        // updating the user
        const userAfterUpdate = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        if (!userAfterUpdate) {
            return res.status(404).send({ error: 'Sorry, not able to update a user.' })
        }
        res.send({ _id, userBeforeUpdates, userAfterUpdate })
    } catch (error) {
        res.status(400).send(error)
    }
})

// finding matches for get requests
// /api/users/?gender=female&mailbox=gmail&age_from=18&age_to=55
router.get('/api/users', auth, async (req, res) => {
    match = {}
    if (req.query.gender) {
        match.gender = req.query.gender
    }
    if (req.query.mailbox) {
        match.email = { $regex: '\u0040' + req.query.mailbox }
    }
    if (req.query.age_from && req.query.age_to) {
        match.age = { $gte: req.query.age_from, $lte: req.query.age_to }
    }
    if (req.query.age_from && !req.query.age_to) {
        match.age = { $gte: req.query.age_from }
    }
    if (!req.query.age_from && req.query.age_to) {
        match.age = { $lte: req.query.age_to }
    }
    try {
        const users = await User.find(match)
        res.send(users)
    } catch (error) {
        res.status(404).send()
    }
})

// Picture upload route
router.post('/api/upload', auth, upload.single('image'), async (req, res) => {
    try {
        req.user.image = req.file.buffer
        await req.user.save()
        res.send()
    }
    catch (error) {
        res.status(400).send(error)
    }
})

module.exports = router