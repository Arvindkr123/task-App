const express = require('express')
const mongoose = require('mongoose')
const amqp = require("amqplib")

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

let channel, connection;

async function connectRabbitMQWithRetry(retries = 5, delay = 3000) {
  while (retries > 0) {
    try {
      connection = await amqp.connect("amqp://rabbitmq");
      channel = await connection.createChannel();

      await channel.assertQueue("task_created", { durable: true });

      console.log("✅ Connected to RabbitMQ");
      return channel;
    } catch (error) {
      console.log("❌ RabbitMQ connection error:", error.message);
      retries--;

      if (retries === 0) {
        console.log("🚨 Max retries reached. Exiting...");
        process.exit(1);
      }

      console.log(`Retrying in ${delay / 1000}s... (${retries} retries left)`);

      await new Promise(res => setTimeout(res, delay));
    }
  }
}

// Create user
app.post("/tasks", async (req, res) => {
    try {
        const newTask = new TaskModel(req.body)
        const taskSaved = await newTask.save()

        const message = { taskId: taskSaved._id, userId: taskSaved.userId, title: taskSaved.title }
        if(!channel){
            return res.status(503).json({
                error:"Rabbit MQ not connected"
            })
        }
        channel.sendToQueue("task_created", Buffer.from(JSON.stringify(message)))

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
        connectRabbitMQWithRetry()
    })
})
.catch(err => console.log(err))