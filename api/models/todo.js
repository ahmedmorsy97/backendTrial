import mongoose from "mongoose";
import mongoose_sequence from "mongoose-sequence";
import mongooseautopopulate from "mongoose-autopopulate";

const { Schema } = mongoose;
const AutoIncrement = mongoose_sequence(mongoose);
const schema = new Schema({
  todoId: {
    type: Number,
    index: true,
    unique: true,
  },
  text: {
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

schema.plugin(AutoIncrement, { inc_field: "todoId" });
schema.plugin(mongooseautopopulate);

export const Todo = mongoose.model("Todos", schema);
