const { MongoClient, ObjectID } = require("mongodb");
const url = "mongodb://localhost:27017/Trial";

MongoClient.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, db) => {
    if (err) {
      return console.log("Unable to connect to MongoDB server");
    }
    console.log("Connected to MongoDB server");

    db.collection("Todos").insertOne(
      {
        test: "Hello to Todos list",
        completed: false,
        createdAt: new Date().toString(),
      },
      (err, result) => {
        if (err) {
          return console.log("Unable to insert todo", err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
      }
    );

    db.collection("Users").insertOne(
      {
        name: "Ahmed Samir Morsy",
        age: 23,
        location: "United Arab Emirates",
        createdAt: new Date(),
      },
      (err, result) => {
        if (err) {
          return console.log("Unable to insert user", err);
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
      }
    );

    db.close();
  }
);
