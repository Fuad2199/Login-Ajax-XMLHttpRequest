import express from "express";
import cors from "cors";

import users from "./users.js"

const app = express();

app.use(express.json());
app.use(express.static('../frontend'))
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to our online shop API...");
});
app.get("/users", (req, res) => {
  res.send(users);
});

const port = process.env.PORT || 5000

app.listen(port, console.log(`Server running on port ${port}`))

