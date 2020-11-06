import { Router } from "express";
import mongoose from "mongoose";
import { User } from "../models";
import _ from "lodash";
import { authenticate } from "../middlewares";
import { compare } from "bcryptjs";

const router = Router();

router.post("/register", (req, res) => {
  if (!req.body.email) {
    res.status(400).send({
      err: "email feild is required !",
    });
  }
  if (!req.body.password) {
    res.status(400).send({
      err: "password feild is required !",
    });
  }
  if (!req.body.phoneNumber) {
    res.status(400).send({
      err: "phoneNumber feild is required !",
    });
  }
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
  });

  user
    .save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then((token) => {
      res.header("x-auth", token).status(200).send(user);
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.post("/login", (req, res) => {
  if (!req.body.email) {
    res.status(400).send({
      err: "email feild is required !",
    });
  }
  if (!req.body.password) {
    res.status(400).send({
      err: "password feild is required !",
    });
  }
  const userData = {
    email: req.body.email,
    password: req.body.password,
  };

  User.findByCredentials(userData.email, userData.password)
    .then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header("x-auth", token).status(200).send(user);
      });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.post("/logout", authenticate, (req, res) => {
  req.user
    .removeToken(req.token)
    .then(() => {
      res.status(200).send({
        message: "You successfully logged out !!!",
      });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.get("/me", authenticate, (req, res) => {
  res.status(200).send(req.user);
});

// router.get("/readAll", (req, res) => {
//   Todo.find()
//     .then(async (todos) => {
//       const count = await Todo.estimatedDocumentCount();
//       res.status(200).send({ todos, count });
//     })
//     .catch((err) => {
//       res.status(400).send({
//         err: err.message ? err.message : err,
//       });
//     });
// });

// router.get("/readOne/:todoId", (req, res) => {
//   if (!req.params.todoId) {
//     res.status(400).send({
//       err: "todoId is required !",
//     });
//   }
//   const todoId = req.params.todoId;
//   if (!mongoose.isValidObjectId(todoId)) {
//     res.status(400).send({
//       err: "todoId is not a valid objectId !",
//     });
//   }

//   Todo.findById(todoId)
//     .then((todo) => {
//       if (!todo) {
//         throw {
//           message: "No todo with this id !",
//         };
//       }
//       res.status(200).send({ todo });
//     })
//     .catch((err) => {
//       res.status(400).send({
//         err: err.message ? err.message : err,
//       });
//     });
// });

// router.post("/delete/:todoId", (req, res) => {
//   if (!req.params.todoId) {
//     res.status(400).send({
//       err: "todoId is required !",
//     });
//   }
//   const todoId = req.params.todoId;
//   if (!mongoose.isValidObjectId(todoId)) {
//     res.status(400).send({
//       err: "todoId is not a valid objectId !",
//     });
//   }

//   Todo.findByIdAndRemove(todoId)
//     .then((todo) => {
//       if (!todo) {
//         throw {
//           message: "No todo with this id !",
//         };
//       }
//       res.status(200).send({
//         todo,
//         message: `Todo with text " ${todo.text} " has been deleted successfully !!`,
//       });
//     })
//     .catch((err) => {
//       res.status(400).send({
//         err: err.message ? err.message : err,
//       });
//     });
// });

// router.post("/update/:todoId", (req, res) => {
//   if (!req.params.todoId) {
//     res.status(400).send({
//       err: "todoId is required !",
//     });
//   }
//   const todoId = req.params.todoId;
//   //   const body = _.pick(req.body, ["text", "completed"]);
//   if (!mongoose.isValidObjectId(todoId)) {
//     res.status(400).send({
//       err: "todoId is not a valid objectId !",
//     });
//   }

//   if (req.body._id) delete req.body._id;

//   Todo.findByIdAndUpdate(
//     todoId,
//     { $set: req.body },
//     {
//       new: true,
//     }
//   )
//     .then((todo) => {
//       if (!todo) {
//         throw {
//           message: "No todo with this id !",
//         };
//       }
//       res.status(200).send({
//         todo,
//         message: `Todo with text " ${todo.text} " has been updated successfully !!`,
//       });
//     })
//     .catch((err) => {
//       res.status(400).send({
//         err: err.message ? err.message : err,
//       });
//     });
// });

export const user = router;
