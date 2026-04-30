const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

let tasks = [];

// ADD TASK
app.post("/add-task", (req, res) => {
  const task = { ...req.body, sent: false };
  tasks.push(task);
  console.log("Task Added:", task);
  res.json({ message: "ok" });
});

// EMAIL SETUP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rawatswati2218@gmail.com",
    pass: "rmzi kwhy ezpl aswd",
  },
});

// CHECK EVERY 10 SEC (FASTER TESTING)
setInterval(() => {
  const now = new Date();

  console.log("Checking tasks...");

  tasks.forEach((task, i) => {
    if (!task.deadline || !task.time || task.sent) return;

    const taskTime = new Date(`${task.deadline}T${task.time}:00`);

    console.log("Now:", now);
    console.log("Task:", taskTime);

    if (now >= taskTime) {
      transporter.sendMail(
        {
          from: "YOUR_EMAIL@gmail.com",
          to: task.email,
          subject: "Reminder",
          text: `Task: ${task.text}`,
        },
        (err) => {
          if (err) {
            console.log("Error:", err);
          } else {
            console.log("Email sent!");
            tasks[i].sent = true;
          }
        }
      );
    }
  });
}, 10000);

app.listen(5000, () => console.log("Server running on 5000"));
