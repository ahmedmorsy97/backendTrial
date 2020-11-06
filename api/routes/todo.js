import { Router } from "express";
import mongoose from "mongoose";
import { Todo } from "../models";
import _ from "lodash";

const router = Router();

router.post("/create", (req, res) => {
  if (!req.body.text) {
    res.status(400).send({
      err: "text feild is required !",
    });
  }
  new Todo({
    text: req.body.text,
    _creator: req.user._id,
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
  Todo.find({ _creator: req.user._id })
    .then(async (todos) => {
      const count = await Todo.find({
        _creator: req.user._id,
      }).count();
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

  Todo.findOne({ _id: todoId, _creator: req.user._id })
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

router.post("/delete/:todoId", (req, res) => {
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

  Todo.findOneAndRemove({ _id: todoId, _creator: req.user._id })
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

router.post("/update/:todoId", (req, res) => {
  if (!req.params.todoId) {
    res.status(400).send({
      err: "todoId is required !",
    });
  }
  const todoId = req.params.todoId;
  //   const body = _.pick(req.body, ["text", "completed"]);
  if (!mongoose.isValidObjectId(todoId)) {
    res.status(400).send({
      err: "todoId is not a valid objectId !",
    });
  }

  if (req.body._id) delete req.body._id;

  Todo.findOneAndUpdate(
    { _id: todoId, _creator: req.user._id },
    { $set: req.body },
    {
      new: true,
    }
  )
    .then((todo) => {
      if (!todo) {
        throw {
          message: "No todo with this id !",
        };
      }
      res.status(200).send({
        todo,
        message: `Todo with text " ${todo.text} " has been updated successfully !!`,
      });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

export const todo = router;
