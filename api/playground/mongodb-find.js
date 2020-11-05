const { MongoClient, ObjectID } = require("mongodb");
const url = "mongodb://localhost:27017/Trial";

MongoClient.connect(url, (err, db) => {
  if (err) {
    return console.log("Unable to connect to MongoDB server");
  }
  console.log("Connected to MongoDB server");

  db.collection("Todos")
    .find()
    .toArray()
    .then(
      (docs) => {
        console.log("Todos");
        console.log(JSON.stringify(docs, undefined, 2));
      },
      (err) => {
        console.log("Unable to read Todos", err);
      }
    );

  //   db.collection("Todos")
  //     .find({ completed: false })
  //     .count()
  //     .then(
  //       (count) => {
  //         console.log(`Todos count is ${count}`);
  //       },
  //       (err) => {
  //         console.log(`Unable to get todos count`, err);
  //       }
  //     );

  db.close();
});
