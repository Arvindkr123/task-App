const express = require('express')
const mongoose = require('mongoose')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})

// Model
const User = mongoose.model("User", userSchema)

// Create user
app.post("/users", async (req, res) => {
    try {
        const newUser = new User(req.body)
        const savedUser = await newUser.save()

        res.status(201).json({
            message: "User created successfully",
            user: savedUser
        })

    } catch (error) {
        res.status(500).json({
            message: "Error creating user",
            error: error.message
        })
    }
})
app.get("/users", async (req, res) => {
    try {
        const users = await User.find({})
        res.status(201).json(users)
    } catch (error) {
        res.status(500).json({
            message: "Error getting users",
            error: error.message
        })
    }
})

// Root route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Task App"
    })
})

// Database connection
mongoose.connect("mongodb://mongo:27018/users")
.then(() => {
    console.log("Database connected")

    app.listen(3001, () => {
        console.log("Server running on port 3001")
    })
})
.catch(err => console.log(err))