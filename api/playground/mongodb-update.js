const { MongoClient, ObjectID } = require("mongodb");
const url = "mongodb://localhost:27017/Trial";

MongoClient.connect(url, (err, db) => {
  if (err) {
    return console.log("Unable to connect to MongoDB server");
  }
  console.log("Connected to MongoDB server");

  db.collection("Todos")
    .findOneAndUpdate(
      { _id: new ObjectID("5fa16376ca08bea2a02137d1") },
      {
        $set: {
          completed: true,
        },
      },
      {
        returnOriginal: false,
      }
    )
    .then(
      (result) => {
        console.log(result.value);
      },
      (err) => {
        console.log("Unable to read Todos", err);
      }
    );

  db.close();
});
