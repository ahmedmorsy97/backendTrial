import mongoose, { Schema } from "mongoose";
import { User } from "../user";
import mongooseautopopulate from "mongoose-autopopulate";

const schema = new Schema({
  places: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Places",
      autopopulate: true,
    },
  ],
});
schema.index({ "$**": "text" });
schema.plugin(mongooseautopopulate);

export const Owner = User.discriminator("owner", schema);
