# Task Management Microservices 🚀

This project demonstrates a **Microservices Architecture** using **Node.js, RabbitMQ, and Docker**.
It consists of three independent services:

* **User Service**
* **Task Service**
* **Notification Service**

The system uses **RabbitMQ** as a message broker to enable **asynchronous communication between services**.

---

# Architecture Overview 🏗️

```
User Service
     │
     │ REST API
     ▼
Task Service ─────────────► RabbitMQ Queue (task_created)
                                   │
                                   │ Message Event
                                   ▼
                          Notification Service
```

### Flow

1. A user interacts with the **User Service**.
2. The **Task Service** creates a task.
3. When a task is created, the Task Service publishes a message to **RabbitMQ**.
4. The **Notification Service** consumes the message and generates a notification.

---

# Services 📦

## 1. User Service 👤

Responsible for user management.

Features:

* Create User
* Get Users
* Manage user data

Runs independently and communicates with other services via APIs.

---

## 2. Task Service 📝

Responsible for managing tasks.

Features:

* Create Task
* Fetch Tasks
* Publish events when a task is created

When a new task is created, the service sends a message to **RabbitMQ**.

Example event:

```json
{
  "taskId": "123",
  "title": "Complete Backend Project",
  "userId": "456"
}
```

This message is sent to the queue:

```
task_created
```

---

## 3. Notification Service 🔔

Responsible for handling notifications.

Features:

* Listens to RabbitMQ queue
* Receives task creation events
* Generates notifications

Example console output:

```
Notification: New Task Created
{
  taskId: "123",
  title: "Complete Backend Project",
  userId: "456"
}
```

---

# Message Broker 📡

The project uses **RabbitMQ** for communication between services.

Queue used:

```
task_created
```

RabbitMQ ensures:

* Asynchronous communication
* Loose coupling between services
* Reliable message delivery

---

# Technologies Used 🛠️

* Node.js
* Express.js
* RabbitMQ
* Docker
* Docker Compose

---

# Project Structure 📂

```
microservices-project
│
├── user-service
│   ├── index.js
│   └── package.json
│
├── task-service
│   ├── index.js
│   └── package.json
│
├── notification-service
│   ├── index.js
│   └── package.json
│
├── docker-compose.yml
│
└── README.md
```

---

# Running the Project 🚀

## 1. Clone the repository

```
git clone https://github.com/your-username/microservices-project.git
```

```
cd microservices-project
```

---

## 2. Start all services

Run Docker Compose:

```
docker-compose up --build
```

This will start:

* User Service
* Task Service
* Notification Service
* RabbitMQ

---

# RabbitMQ Management UI 📊

You can access RabbitMQ dashboard at:

```
http://localhost:15672
```

Login credentials:

```
username: guest
password: guest
```

---

# Example Workflow 🧪

1. Create a task using the **Task Service API**
2. Task Service publishes a message to **RabbitMQ**
3. Notification Service receives the event
4. Notification is generated

Console output example:

```
Notification: New Task Created
{
  title: "Build Microservice Project",
  userId: "1"
}
```

---

# Benefits of this Architecture ✨

* Services are **independent**
* **Scalable architecture**
* **Loose coupling**
* **Event-driven communication**
* Easy to add new services

Example:

```
Email Service
Analytics Service
Logging Service
```

All can subscribe to the same queue.

---

# Future Improvements 🚀

* Add **API Gateway**
* Add **Authentication (JWT)**
* Add **Database (MongoDB / PostgreSQL)**
* Implement **Dead Letter Queue**
* Add **Logging & Monitoring**

---

# Author 👨‍💻

Backend Microservices Demo Project using Node.js and RabbitMQ.
