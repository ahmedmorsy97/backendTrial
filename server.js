import "./api/db/mongoose.js";
import mongoose from "mongoose";
import { Todo } from "./api/models";

import express, { json, urlencoded } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import hbs from "hbs";
import fs from "fs";
// import { todo } from "./api/routes/todo";

const port = process.env.PORT || 5000;
var app = express();
app.use(json());
app.use(
  urlencoded({
    extended: false,
  })
);
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.set("view engine", "hbs");

// loging
app.use((req, res, next) => {
  const now = new Date().toString();
  const log = `${now}: ${req.method} ${req.url}`;
  fs.appendFile("server.log", log + "\n", (err) => {
    if (err) {
      console.log("Unable to append to server.log");
    }
  });
  next();
});

app.get("/", (req, res) => {
  res.send("<h1>Welcome to trial app</h1>");
});

// app.post("/api/todos", todo);

app.post("/api/todos/create", (req, res) => {
  if (!req.body.text) {
    res.status(400).send({
      err: "text feild is required !",
    });
  }
  new Todo({
    text: req.body.text,
  })
    .save()
    .then((rec) => {
      res.status(200).send(rec);
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

app.get("/api/todos/readAll", (req, res) => {
  Todo.find()
    .then((todos) => {
      Todo.estimatedDocumentCount().then((count) => {
        res.status(200).send({ todos, count });
      });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

app.get("/api/todos/readOne/:todoId", (req, res) => {
  if (!req.params.todoId) {
    res.status(400).send({
      err: "todoId is required !",
    });
  }
  const todoId = req.params.todoId;
  if (!mongoose.isValidObjectId(todoId)) {
    res.status(400).send({
      err: "todoId is not a valid objectId !",
    });
  }

  Todo.findById(todoId)
    .then((todo) => {
      if (!todo) {
        throw {
          message: "No todo with this id !",
        };
      }
      res.status(200).send({ todo });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

app.use((req, res) =>
  res.status(404).send("<h1>Can not find what you're looking for</h1>")
);
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
