const express = require('express')
const mongoose = require('mongoose')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Schema
const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    userId:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

// Model
const TaskModel = mongoose.model("Task", taskSchema)

// Create user
app.post("/tasks", async (req, res) => {
    try {
        const newTask = new TaskModel(req.body)
        const taskSaved = await newTask.save()

        res.status(201).json({
            message: "Task created successfully",
            user: taskSaved
        })

    } catch (error) {
        res.status(500).json({
            message: "Error creating task",
            error: error.message
        })
    }
})
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await TaskModel.find({})
        res.status(200).json(tasks)
    } catch (error) {
        res.status(500).json({
            message: "Error getting tasks",
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
mongoose.connect("mongodb://task-app-mongo:27017/users")
.then(() => {
    console.log("Database connected")

    app.listen(3002, () => {
        console.log("Server running on port 3002")
    })
})
.catch(err => console.log(err))