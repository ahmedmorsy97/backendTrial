import mongoose, { Schema } from "mongoose";
import mongoose_sequence from "mongoose-sequence";
import mongooseautopopulate from "mongoose-autopopulate";
import moment from "moment";

const AutoIncrement = mongoose_sequence(mongoose);
const schema = new Schema({
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  isRemoved: {
    type: Boolean,
    default: false,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  stopWaitingList: {
    type: Boolean,
    default: false,
  },
  stopCounterList: {
    type: Boolean,
    default: false,
  },
  placeId: {
    type: Number,
    index: true,
    unique: true,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    autopopulate: true,
    required: true,
  },
  employees: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      // autopopulate: true,
    },
  ],
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
    enum: ["resturant", "bank", "coffee-shop", "store", "grocery", "goverment"],
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  mobileNumbers: [
    {
      type: String,
      minlength: 1,
    },
  ],
  branch: {
    type: String,
    required: true,
    trim: true,
    default: "main",
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  isInOutdoor: {
    type: Boolean,
    default: false,
  },
  photos: [
    {
      url: String,
      name: String,
    },
  ],
  openWaitinglist: {
    type: Boolean,
    default: false,
  },
  openCounterlist: {
    type: Boolean,
    default: false,
  },
  logo: {
    url: String,
    name: {
      type: String,
      default: "Logo",
    },
  },
  reviews: [
    {
      user: {
        type: mongoose.Types.ObjectId,
        ref: "Users",
        // autopopulate: true,
      },
      name: {
        type: String,
        default: "anonymous",
      },
      review: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
      },
      rating: {
        type: Number,
        required: true,
      },
      createdAt: { type: Date, default: moment().valueOf() },
    },
  ],
  workingHours: {
    open: {
      type: String,
      required: true,
    },
    close: {
      type: String,
      required: true,
    },
    neverClose: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  waitingList: [
    {
      isUser: {
        type: Boolean,
        required: true,
      },
      user: {
        type: mongoose.Types.ObjectId,
        ref: "Users",
      },
      numberOfPeople: {
        type: Number,
        default: 1,
      },
      preferedPlace: {
        type: String,
        enum: ["indoor", "outdoor"],
        default: "indoor",
      },
      displayName: {
        type: String,
      },
    },
  ],
  counterList: {
    counter: {
      type: Number,
      default: 0,
    },
    list: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "Users",
        },
        numberInList: {
          type: Number,
          unique: true,
        },
        createdAt: {
          type: Date,
          default: moment().valueOf(),
        },
      },
    ],
  },
});
schema.index({ "$**": "text" });
schema.plugin(AutoIncrement, { inc_field: "placeId" });
schema.plugin(mongooseautopopulate);

export const Place = mongoose.model("Places", schema);
