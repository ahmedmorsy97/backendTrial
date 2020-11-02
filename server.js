const express = require("express");
const hbs = require("hbs");
const fs = require("fs");

const port = process.env.PORT || 5000;
var app = express();

hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");

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

app.use(express.static(__dirname + "/public"));

hbs.registerHelper("getCurrentYear", () => {
  return new Date().getFullYear() + "";
});

hbs.registerHelper("upperText", (text) => {
  return text.toUpperCase();
});

app.get("/", (req, res) => {
  res.send("<h1>Welcome to trial app</h1>");
});

app.get("/bad", (req, res) => {
  res.send({
    errorMessage: "Unable to connect to the server !!!",
  });
});

app.get("/about", (req, res) => {
  res.render("about.hbs", {
    title: "About Page",
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
