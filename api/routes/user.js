import { Router } from "express";
import mongoose from "mongoose";
import { Customer, Owner, User } from "../models";
import _ from "lodash";
import { authenticate } from "../middlewares";
import { compare } from "bcryptjs";

const router = Router();

router.post("/register", (req, res) => {
  const cookie = req.cookies.userLogin;

  if (cookie) {
    return res.status(400).send({
      err: "You are already logged In!",
    });
  }

  if (!req.body.email) {
    return res.status(400).send({
      err: "email feild is required !",
    });
  }
  if (!req.body.password) {
    return res.status(400).send({
      err: "password feild is required !",
    });
  }
  if (!req.body.phoneNumber) {
    return res.status(400).send({
      err: "phoneNumber feild is required !",
    });
  }
  const userData = {
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    birthDate: req.body.birthDate ? req.body.birthDate : null,
    gender: req.body.gender ? req.body.gender : null,
    firstName: req.body.firstName ? req.body.firstName : null,
    lastName: req.body.lastName ? req.body.lastName : null,
  };
  if (!userData.birthDate) {
    delete userData.birthDate;
  }
  if (!userData.gender) {
    delete userData.gender;
  }
  if (!userData.firstName) {
    delete userData.firstName;
  }
  if (!userData.lastName) {
    delete userData.lastName;
  }

  const user = new Customer({ ...userData });
  user
    .save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then((token) => {
      if (process.env.NODE_ENV === "production")
        res.cookie("userLogin", token, {
          sameSite: "none",
          expires: new Date(253402300799999),
          secure: true,
          httpOnly: true,
        });
      else
        res.cookie("userLogin", token, {
          expires: new Date(253402300799999),
          httpOnly: true,
        });
      res.header("x-auth", token).status(200).send(user);
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.post("/owner/register", (req, res) => {
  const cookie = req.cookies.userLogin;

  if (cookie) {
    return res.status(400).send({
      err: "You are already logged In!",
    });
  }

  if (!req.body.email) {
    return res.status(400).send({
      err: "email feild is required !",
    });
  }
  if (!req.body.password) {
    return res.status(400).send({
      err: "password feild is required !",
    });
  }
  if (!req.body.phoneNumber) {
    return res.status(400).send({
      err: "phoneNumber feild is required !",
    });
  }
  const userData = {
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    birthDate: req.body.birthDate ? req.body.birthDate : null,
    gender: req.body.gender ? req.body.gender : null,
    firstName: req.body.firstName ? req.body.firstName : null,
    lastName: req.body.lastName ? req.body.lastName : null,
  };
  if (!userData.birthDate) {
    delete userData.birthDate;
  }
  if (!userData.gender) {
    delete userData.gender;
  }
  if (!userData.firstName) {
    delete userData.firstName;
  }
  if (!userData.lastName) {
    delete userData.lastName;
  }

  const user = new Owner({ ...userData });
  user
    .save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then((token) => {
      if (process.env.NODE_ENV === "production")
        res.cookie("userLogin", token, {
          sameSite: "none",
          expires: new Date(253402300799999),
          secure: true,
          httpOnly: true,
        });
      else
        res.cookie("userLogin", token, {
          expires: new Date(253402300799999),
          httpOnly: true,
        });

      res.header("x-auth", token).status(200).send(user);
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.post("/login", (req, res) => {
  const cookie = req.cookies.userLogin;
  // console.log(req.cookies);
  // console.log(req.signedCookies);
  if (cookie && cookie !== "") {
    return res.status(400).send({
      err: "You are already logged In!",
    });
  }

  if (!req.body.email) {
    return res.status(400).send({
      err: "email feild is required !",
    });
  }
  if (!req.body.password) {
    return res.status(400).send({
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
        if (process.env.NODE_ENV === "production")
          res.cookie("userLogin", token, {
            sameSite: "none",
            expires: new Date(253402300799999),
            secure: true,
            httpOnly: true,
            // domain: "backend-trial.vercel.app",
          });
        else
          res.cookie("userLogin", token, {
            expires: new Date(253402300799999),
            httpOnly: true,
          });

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
      if (process.env.NODE_ENV === "production")
        res.cookie("userLogin", "", {
          sameSite: "none",
          expires: new Date(),
          secure: true,
          httpOnly: true,
        });
      else
        res.cookie("userLogin", "", {
          expires: new Date(),
          httpOnly: true,
        });

      res.clearCookie("userLogin");
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

router.post("/update", authenticate, (req, res) => {
  if (req.body.waitingListHistory) delete req.body.waitingListHistory;
  if (req.body.favoratePlaces) delete req.body.favoratePlaces;
  if (req.body.emailConfirmed) delete req.body.emailConfirmed;
  if (req.body.waitingLists) delete req.body.waitingLists;
  if (req.body.isBanned) delete req.body.isBanned;
  if (req.body.password) delete req.body.password;
  if (req.body.rating) delete req.body.rating;
  if (req.body.userId) delete req.body.userId;
  if (req.body.tokens) delete req.body.tokens;
  if (req.body._id) delete req.body._id;

  User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: req.body },
    {
      new: true,
    }
  )
    .then((user) => {
      if (!user) {
        throw {
          message: "No user with this id !",
        };
      }
      res.status(200).send({
        user,
        message: `You have update part/s fo your account successfully !!`,
      });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.post("/removeFromArray", authenticate, (req, res) => {
  if (req.body.waitingListHistory) delete req.body.waitingListHistory;
  if (req.body.favoratePlaces) delete req.body.favoratePlaces;
  if (req.body.waitingLists) delete req.body.waitingLists;
  if (req.body.emailConfirmed) delete req.body.emailConfirmed;
  if (req.body.isBanned) delete req.body.isBanned;
  if (req.body.password) delete req.body.password;
  if (req.body.rating) delete req.body.rating;
  if (req.body.userId) delete req.body.userId;
  if (req.body.tokens) delete req.body.tokens;
  if (req.body._id) delete req.body._id;

  if (!req.body.subdocumentName) {
    return res.status(400).send({
      err: "Subdocument name is required !!",
    });
  }

  if (!req.body.subdocumentId) {
    return res.status(400).send({
      err: "Subdocument id is required !!",
    });
  }

  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $pull: {
        [`${req.body.subdocumentName}`]: req.body.subdocumentId,
      },
    },
    {
      new: true,
    }
  )
    .then((user) => {
      if (!user) {
        throw {
          message: "No user with this id !",
        };
      }
      res.status(200).send({
        user,
        message: `You have update part/s fo your account successfully !!`,
      });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.post("/addToArray", authenticate, (req, res) => {
  if (req.body.waitingListHistory) delete req.body.waitingListHistory;
  if (req.body.favoratePlaces) delete req.body.favoratePlaces;
  if (req.body.waitingLists) delete req.body.waitingLists;
  if (req.body.emailConfirmed) delete req.body.emailConfirmed;
  if (req.body.isBanned) delete req.body.isBanned;
  if (req.body.password) delete req.body.password;
  if (req.body.rating) delete req.body.rating;
  if (req.body.userId) delete req.body.userId;
  if (req.body.tokens) delete req.body.tokens;
  if (req.body._id) delete req.body._id;

  if (!req.body.subdocumentName) {
    return res.status(400).send({
      err: "Subdocument name is required !!",
    });
  }

  if (!req.body.subdocumentBody) {
    return res.status(400).send({
      err: "Subdocument body is required !!",
    });
  }

  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $push: {
        [`${req.body.subdocumentName}`]: req.body.subdocumentBody,
      },
    },
    {
      new: true,
    }
  )
    .then((user) => {
      if (!user) {
        throw {
          message: "No user with this id !",
        };
      }
      res.status(200).send({
        user,
        message: `You have update part/s fo your account successfully !!`,
      });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.post("/removeFromFavorateArray", authenticate, (req, res) => {
  if (req.body.waitingListHistory) delete req.body.waitingListHistory;
  if (req.body.favoratePlaces) delete req.body.favoratePlaces;
  if (req.body.waitingLists) delete req.body.waitingLists;
  if (req.body.emailConfirmed) delete req.body.emailConfirmed;
  if (req.body.isBanned) delete req.body.isBanned;
  if (req.body.password) delete req.body.password;
  if (req.body.rating) delete req.body.rating;
  if (req.body.userId) delete req.body.userId;
  if (req.body.tokens) delete req.body.tokens;
  if (req.body._id) delete req.body._id;

  // if (!req.body.subdocumentName) {
  //   return res.status(400).send({
  //     err: "Subdocument name is required !!",
  //   });
  // }

  if (!req.body.subdocumentId) {
    return res.status(400).send({
      err: "Subdocument id is required !!",
    });
  }

  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $pull: {
        favoratePlaces: req.body.subdocumentId,
      },
    },
    {
      new: true,
    }
  )
    .then((user) => {
      if (!user) {
        throw {
          message: "No user with this id !",
        };
      }
      res.status(200).send({
        user,
        message: `You have update part/s fo your account successfully !!`,
      });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.post("/addToFavorateArray", authenticate, (req, res) => {
  if (req.body.waitingListHistory) delete req.body.waitingListHistory;
  if (req.body.favoratePlaces) delete req.body.favoratePlaces;
  if (req.body.waitingLists) delete req.body.waitingLists;
  if (req.body.emailConfirmed) delete req.body.emailConfirmed;
  if (req.body.isBanned) delete req.body.isBanned;
  if (req.body.password) delete req.body.password;
  if (req.body.rating) delete req.body.rating;
  if (req.body.userId) delete req.body.userId;
  if (req.body.tokens) delete req.body.tokens;
  if (req.body._id) delete req.body._id;

  // if (!req.body.subdocumentName) {
  //   return res.status(400).send({
  //     err: "Subdocument name is required !!",
  //   });
  // }

  if (!req.body.subdocumentBody) {
    return res.status(400).send({
      err: "Subdocument body is required !!",
    });
  }

  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $push: {
        favoratePlaces: req.body.subdocumentBody,
      },
    },
    {
      new: true,
    }
  )
    .then((user) => {
      if (!user) {
        throw {
          message: "No user with this id !",
        };
      }
      res.status(200).send({
        user,
        message: `You have update part/s fo your account successfully !!`,
      });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

export const user = router;
