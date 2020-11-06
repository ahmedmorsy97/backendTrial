import "./api/db/mongoose.js";

import express, { json, urlencoded } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import hbs from "hbs";
import fs from "fs";
import { todo, user } from "./api/routes";
import { authenticate } from "./api/middlewares";

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

app.use("/api/todos", authenticate, todo);
app.use("/api/users", user);

app.use((req, res) =>
  res.status(404).send("<h1>Can not find what you're looking for</h1>")
);
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
