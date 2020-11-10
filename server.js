import "./api/db/mongoose.js";

import express, { json, urlencoded } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import hbs from "hbs";
import fs from "fs";
import { todo, user } from "./api/routes";
import { authenticate } from "./api/middlewares";

import path from "path";
import http from "http";
import socketIO from "socket.io";
import moment from "moment";

import { isRealString } from "./api/utils";
import { Users } from "./api/utils";

const publicPath = path.join(__dirname, "./api/public");
const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const users = new Users();

io.on("connection", (socket) => {
  console.log("New user is connected");

  // socket.emit("newEmail", {
  //   from: "ahmed@hmail.com",
  //   text: "Hello, dear",
  // });

  // socket.on("createEmail", (data) => {
  //   console.log("User create a mail");
  //   console.log(data);
  // });

  // socket.emit("newEmail", {
  //   from: "ahmed@hmail.com",
  //   text: "Hello, dear",
  // });

  socket.on("join", (params, callback) => {
    if (!(isRealString(params.name) && isRealString(params.room))) {
      callback("Invalid params");
    }
    if (users.checkUserName(params.name.trim())) {
      callback("Name already taken");
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name.trim(), params.room.trim());

    // io.emit (emit to all) -> io.to(room).emit
    // socket.broadcast.emit (emit to all except me) -> socket.broadcast.to(room).emit
    // socket.emit (emit to specific one)

    io.to(params.room).emit("updateUserList", users.getUserList(params.room));

    socket.emit("newMessage", {
      from: "Admin",
      text: "Welcome to the chat app",
      createdAt: moment().valueOf(),
    });

    socket.broadcast.to(params.room).emit("newMessage", {
      from: "Admin",
      text: `${params.name} joined the room.`,
      createdAt: moment().valueOf(),
    });

    callback();
  });

  socket.on("createMessage", (data, callback) => {
    const user = users.getUser(socket.id);
    if (user && isRealString(data.text)) {
      io.to(user.room).emit("newMessage", {
        from: user.name,
        text: data.text,
        createdAt: moment().valueOf(),
      });
    }
    callback();
  });

  socket.on("createLocationMessage", (data) => {
    const user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit("newLocationMessage", {
        from: user.name,
        url: `https://www.google.com/maps?q=${data.lat},${data.long}`,
        createdAt: moment().valueOf(),
      });
    }
  });

  socket.on("disconnect", () => {
    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("updateUserList", users.getUserList(user.room));
      io.to(user.room).emit("newMessage", {
        from: "Admin",
        text: `${user.name} left the room.`,
        createdAt: moment().valueOf(),
      });
    }
  });
});
app.use(express.static(publicPath));

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

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
