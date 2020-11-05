import { Router } from "express";
import mongoose from "mongoose";
import { Todo } from "../models";

const router = Router();

router.post("/create", (req, res) => {
  if (!req.body.text) {
    res.status(400).send({
      err: "text feild is required !",
    });
  }
  new Todo({
    text: req.body.text,
  })
    .save()
    .then((todo) => {
      res.status(200).send(todo);
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.get("/readAll", (req, res) => {
  Todo.find()
    .then(async (todos) => {
      const count = await Todo.estimatedDocumentCount();
      res.status(200).send({ todos, count });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.get("/readOne/:todoId", (req, res) => {
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

router.delete("/deletOne/:todoId", (req, res) => {
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

  Todo.findByIdAndRemove(todoId)
    .then((todo) => {
      if (!todo) {
        throw {
          message: "No todo with this id !",
        };
      }
      res.status(200).send({
        todo,
        message: `Todo with text " ${todo.text} " has been deleted successfully !!`,
      });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

export const todo = router;
