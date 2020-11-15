import mongoose, { Schema } from "mongoose";
import { User } from "../user";
import mongooseautopopulate from "mongoose-autopopulate";

const schema = new Schema({});
schema.index({ "$**": "text" });

schema.plugin(mongooseautopopulate);

export const Customer = User.discriminator("customer", schema);
