const { MongoClient, ObjectID } = require("mongodb");
const url = "mongodb://localhost:27017/Trial";

MongoClient.connect(url, (err, db) => {
  if (err) {
    return console.log("Unable to connect to MongoDB server");
  }
  console.log("Connected to MongoDB server");

  //deleteMany
  //   db.collection("Todos")
  //     .deleteMany({ test: "Hello to Todos list" })
  //     .then(
  //       (result) => {
  //         console.log(result.result);
  //       },
  //       (err) => {
  //         console.log("Unable to delete todo/s", err);
  //       }
  //     );

  //deleteOne
  //   db.collection("Todos")
  //     .deleteOne({ _id: new ObjectID("5fa13a1c41cf74bce8fc06da") })
  //     .then((result) => {
  //       if (result.result.n === 0) throw "Nothing to be deleted";
  //       console.log(result.result);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  //fineOneAndDelete
  db.collection("Todos")
    .findOneAndDelete({ _id: new ObjectID("5fa13ab54ce70b9d6c38bcf6") })
    .then((result) => {
      if (!result.value) throw "No record found by this id !!";
      console.log(result.value);
    })
    .catch((err) => {
      console.log(err);
    });

  db.close();
});
