const amqp = require("amqplib")

async function start(retries = 10) {
  try {

    const connection = await amqp.connect("amqp://rabbitmq")

    const channel = await connection.createChannel()

    await channel.assertQueue("task_created", { durable: true })

    console.log("🚀 Notification service started")

    channel.consume("task_created", (msg) => {
      const taskData = JSON.parse(msg.content.toString())

      console.log("🔔 Notification: new task", taskData)

      channel.ack(msg)
    })

  } catch (error) {

    console.log("RabbitMQ connection error:", error.message)

    if (retries > 0) {
      console.log(`Retrying... ${retries} attempts left`)

      setTimeout(() => {
        start(retries - 1)
      }, 5000)

    } else {
      console.log("❌ Could not connect to RabbitMQ")
    }
  }
}

start()