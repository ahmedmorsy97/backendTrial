import mongoose from "mongoose";

// `mongodb:
//${process.env.MONGO_USERNAME}:${encodeURIComponent(
//     process.env.MONGO_PASSWORD
//   )}@mongo-payment:27017/Trial`

const url = "mongodb://localhost:27017/Trial";
const URI =
  `${process.env.NODE_ENV}` === "production"
    ? `mongodb+srv://${process.env.MognoDB_UserName}:${process.env.MognoDB_Password}@trial.kzrgi.mongodb.net/Trial?retryWrites=true&w=majority`
    : url;
(async () => {
  try {
    // console.log("URI", URI);
    const { connection } = await mongoose.connect(URI, {
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      retryWrites: false,
      useNewUrlParser: true,
    });

    // if (`${process.env.NODE_ENV}` !== "production") {
    //   await connection.db.dropDatabase();
    //   console.log("MongoDB Dropped...");
    //   console.time("Population Script took");
    //   await populationScript();
    //   console.log("Population Script Done...");
    //   console.timeLog("Population Script took");
    // }
  } catch (error) {
    console.error(error);
  }
})();
