import mongoose from "mongoose";
import mongoose_sequence from "mongoose-sequence";
import mongooseautopopulate from "mongoose-autopopulate";
import { hash } from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import { secretOrPrivateKey } from "../../configs";
import _ from "lodash";
import bcrypt from "bcryptjs";
import moment from "moment";

const { Schema } = mongoose;
const AutoIncrement = mongoose_sequence(mongoose);
const schema = new Schema(
  {
    userId: {
      type: Number,
      index: true,
      unique: true,
    },
    emailConfirmed: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    password: String,
    phoneNumber: {
      type: String,
      index: true,
      sparse: true,
      required: true,
      trim: true,
      unique: true,
    },
    birthDate: Date,
    gender: { type: String, enum: ["male", "female", "other"] },
    firstName: String,
    lastName: String,
    email: {
      type: String,
      index: true,
      sparse: true,
      lowercase: true,
      required: true,
      trim: true,
      unique: true,

      validate: {
        validator: validator.isEmail,
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    rating: {
      type: Number,
      default: 5,
    },
    tokens: [
      {
        access: {
          type: String,
          required: true,
        },
        token: {
          type: String,
          required: true,
        },
      },
    ],
    waitingListHistory: [
      {
        place: {
          type: mongoose.Types.ObjectId,
          ref: "Places",
        },
        rating: {
          type: Number,
        },
        comment: {
          type: String,
        },
        attendance: {
          type: String,
          enum: ["attended", "left", "missed"],
        },
        name: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          defaut: moment().valueOf(),
        },
      },
    ],
    favoratePlaces: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Places",
        autopopulate: true,
      },
    ],
    waitingLists: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Places",
        // autopopulate: true,
      },
    ],
  },
  {
    timestamps: true,
    discriminatorKey: "userType",
  }
);

schema.plugin(AutoIncrement, { inc_field: "userId" });
schema.plugin(mongooseautopopulate);

schema.pre("save", async function () {
  if (this.isModified("password"))
    this.password = await hash(this.password, 10);
});
schema.pre("findOneAndUpdate", async function () {
  if (this._update && this._update.password)
    this._update.password = await hash(this._update.password, 10);
});

schema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  return _.pick(userObject, [
    "_id",
    "email",
    "phoneNumber",
    "favoratePlaces",
    "waitingLists",
    "emailConfirmed",
    "rating",
    "userType",
    "waitingListHistory",
    "userId",
  ]);
};

schema.methods.generateAuthToken = function () {
  const user = this;
  const access = "auth";
  const token = jwt.sign(
    { _id: user._id.toHexString(), access },
    secretOrPrivateKey
  );
  user.tokens.push({
    access,
    token,
  });

  return user.save().then(() => {
    return token;
  });
};

schema.methods.removeToken = function (token) {
  const user = this;

  return user.updateOne({
    $pull: {
      tokens: {
        token,
      },
    },
  });
};

schema.statics.findByToken = function (token) {
  const User = this;
  // let decoded;

  // try {
  //   decoded = jwt.verify(token, secretOrPrivateKey);
  // } catch (err) {
  //   return Promise.reject({
  //     message: err,
  //   });
  // }

  return User.findOne({
    // _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth",
  });
};

schema.statics.findByCredentials = function (email, password) {
  const User = this;

  return User.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject({
        message: "email is incorrect !!",
      });
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject({
            message: "password is incorrect !!",
            err,
          });
        }
      });
    });
  });
};

export const User = mongoose.model("Users", schema);
