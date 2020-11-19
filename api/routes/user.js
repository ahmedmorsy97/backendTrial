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
      res.cookie("userLogin", token, { sameSite: false });
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
      res.cookie("userLogin", token, { sameSite: false });
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
  const userData = {
    email: req.body.email,
    password: req.body.password,
  };

  User.findByCredentials(userData.email, userData.password)
    .then((user) => {
      return user.generateAuthToken().then((token) => {
        res.cookie("userLogin", token, { sameSite: false });
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

export const user = router;
