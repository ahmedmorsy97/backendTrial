import { Router } from "express";
import mongoose from "mongoose";
import { Customer, Place, User } from "../models";
import _, { at, rearg } from "lodash";
import { authenticate } from "../middlewares";
import moment from "moment";

const router = Router();

router.post("/owner/create", authenticate, (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      err: "name feild is required !",
    });
  }
  if (!req.body.type) {
    return res.status(400).send({
      err: "type feild is required !",
    });
  }
  if (!req.body.address) {
    return res.status(400).send({
      err: "address feild is required !",
    });
  }
  if (!req.body.mobileNumbers) {
    return res.status(400).send({
      err: "mobileNumbers feild is required !",
    });
  }
  if (!req.body.branch) {
    return res.status(400).send({
      err: "branch feild is required !",
    });
  }
  if (!req.body.category) {
    return res.status(400).send({
      err: "category feild is required !",
    });
  }
  if (
    !req.body.workingHours ||
    !req.body.workingHours.open ||
    !req.body.workingHours.close
  ) {
    return res.status(400).send({
      err: "workingHours feild/s is required !",
    });
  }
  const placeData = {
    owner: req.user._id,
    name: req.body.name,
    type: req.body.type,
    address: req.body.address,
    mobileNumbers: req.body.mobileNumbers,
    branch: req.body.branch,
    category: req.body.category,
    description: req.body.description ? req.body.description : null,
    isInOutdoor: req.body.isInOutdoor ? req.body.isInOutdoor : null,
    photos: req.body.photos ? req.body.photos : null,
    logo: req.body.logo ? req.body.logo : null,
    workingHours: {
      open: req.body.workingHours.open,
      close: req.body.workingHours.close,
      neverClose: req.body.workingHours.neverClose,
    },
  };

  if (!placeData.description) {
    delete placeData.description;
  }
  if (!placeData.isInOutdoor) {
    delete placeData.isInOutdoor;
  }
  if (!placeData.photos) {
    delete placeData.photos;
  }
  if (!placeData.logo) {
    delete placeData.logo;
  }

  new Place(placeData)
    .save()
    .then((place) => {
      res.status(200).send(place);
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.post("/readAll", (req, res) => {
  const { queryBody, search, page, sort, limit } = req.body;
  const skip = limit * (page - 1);
  if (search) queryBody.$text = { $search: search };
  Place.find({ isRemoved: false, ...queryBody })
    .select("-isBanned -isRemoved -owner -employees")
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .then(async (places) => {
      const count = await Place.countDocuments(queryBody)
        .select("-isBanned -isRemoved -owner -employees")
        .sort(sort);
      const pages = Math.ceil(count / limit);
      res.status(200).send({ places, pages });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.get("/readOne/:placeId", (req, res) => {
  if (!req.params.placeId) {
    return res.status(400).send({
      err: "placeId is required !",
    });
  }
  const placeId = req.params.placeId;
  if (!mongoose.isValidObjectId(placeId)) {
    return res.status(400).send({
      err: "placeId is not a valid objectId !",
    });
  }

  Place.findOne({ _id: placeId })
    .select("-isConfirmed -isRemoved -owner -employees")
    .then((place) => {
      if (!place) {
        throw {
          message: "No place with this id !",
        };
      }
      res.status(200).send({ place });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.get("/owner/readAll", authenticate, (req, res) => {
  const { queryBody, search, page, select, sort, limit } = req.body;
  const skip = limit * (page - 1);
  if (search) queryBody.$text = { $search: search };
  Place.find({ owner: req.user._id, ...queryBody })
    .select(select)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .then(async (places) => {
      const count = await Place.countDocuments(queryBody)
        .select(select)
        .sort(sort);
      const pages = Math.ceil(count / limit);
      res.status(200).send({ places, pages });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.get("/owner/readOne/:placeId", authenticate, (req, res) => {
  if (!req.params.placeId) {
    return res.status(400).send({
      err: "placeId is required !",
    });
  }
  const placeId = req.params.placeId;
  if (!mongoose.isValidObjectId(placeId)) {
    return res.status(400).send({
      err: "placeId is not a valid objectId !",
    });
  }
  Place.findOne({ _id: placeId, owner: req.user._id })
    .then((place) => {
      if (!place) {
        throw {
          message: "No place with this id !",
        };
      }
      res.status(200).send({ place });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.post("/owner/archive/:placeId", authenticate, (req, res) => {
  if (!req.params.placeId) {
    return res.status(400).send({
      err: "placeId is required !",
    });
  }
  const placeId = req.params.placeId;
  if (!mongoose.isValidObjectId(placeId)) {
    return res.status(400).send({
      err: "placeId is not a valid objectId !",
    });
  }

  Place.findOneAndUpdate(
    {
      _id: placeId,
      owner: req.user._id,
    },
    { $set: { isRemoved: true } },
    {
      new: true,
    }
  )
    .then((place) => {
      if (!place) {
        throw {
          message: "No place with this id !",
        };
      }
      res.status(200).send({
        place,
        message: `Place with name " ${place.name} " has been archived successfully !!`,
      });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.post("/owner/unarchive/:placeId", authenticate, (req, res) => {
  if (!req.params.placeId) {
    return res.status(400).send({
      err: "placeId is required !",
    });
  }
  const placeId = req.params.placeId;
  if (!mongoose.isValidObjectId(placeId)) {
    return res.status(400).send({
      err: "placeId is not a valid objectId !",
    });
  }

  Place.findOneAndUpdate(
    {
      _id: placeId,
      owner: req.user._id,
    },
    { $set: { isRemoved: false } },
    {
      new: true,
    }
  )
    .then((place) => {
      if (!place) {
        throw {
          message: "No place with this id !",
        };
      }
      res.status(200).send({
        place,
        message: `Place with name " ${place.name} " has been archived successfully !!`,
      });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.post("/owner/update/:placeId", authenticate, (req, res) => {
  if (!req.params.placeId) {
    return res.status(400).send({
      err: "placeId is required !",
    });
  }
  const placeId = req.params.placeId;
  if (!mongoose.isValidObjectId(placeId)) {
    return res.status(400).send({
      err: "placeId is not a valid objectId !",
    });
  }

  if (req.body.openWaitinglist) delete req.body.openWaitinglist;
  if (req.body.isConfirmed) delete req.body.isConfirmed;
  if (req.body.waitingList) delete req.body.waitingList;
  if (req.body.isRemoved) delete req.body.isRemoved;
  if (req.body.isBanned) delete req.body.isBanned;
  if (req.body.placeId) delete req.body.placeId;
  if (req.body.reviews) delete req.body.reviews;
  if (req.body.owner) delete req.body.owner;
  if (req.body._id) delete req.body._id;

  Place.findOneAndUpdate(
    { _id: placeId, owner: req.user._id },
    { $set: req.body },
    {
      new: true,
    }
  )
    .then((place) => {
      if (!place) {
        throw {
          message: "No place with this id !",
        };
      }
      res.status(200).send({
        place,
        message: `${place.type} with name " ${place.name} " has been updated successfully !!`,
      });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.post(
  "/owner/updateOpenWaitingList/:placeId",
  authenticate,
  (req, res) => {
    if (!req.params.placeId) {
      return res.status(400).send({
        err: "placeId is required !",
      });
    }
    const placeId = req.params.placeId;
    if (!mongoose.isValidObjectId(placeId)) {
      return res.status(400).send({
        err: "placeId is not a valid objectId !",
      });
    }
    Place.findOne({ _id: placeId, owner: req.user._id })
      .then((place) => {
        if (!place) {
          throw {
            message: "No place with this id !",
          };
        }
        if (
          place.waitingList &&
          place.waitingList.length > 0 &&
          place.openWaitinglist
        ) {
          throw {
            message:
              "There are customer in the waitingList, so you can not close it. But you can stop it.",
          };
        } else {
          return Place.findOneAndUpdate(
            { _id: placeId, owner: req.user._id },
            {
              $set: {
                openWaitinglist: !place.openWaitinglist,
                stopWaitingList: false,
              },
            },
            {
              new: true,
            }
          );
        }
        //   res.status(200).send({ place });
      })
      .then((place) => {
        if (!place) {
          throw {
            message: "No place with this id !",
          };
        }
        res.status(200).send({
          place,
          message: `" ${place.name} "'s waiting list has been updated successfully !!`,
        });
      })
      .catch((err) => {
        res.status(400).send({
          err: err.message ? err.message : err,
        });
      });
  }
);

router.post("/owner/addToWaitingList/:placeId", authenticate, (req, res) => {
  if (!req.params.placeId) {
    return res.status(400).send({
      err: "placeId is required !",
    });
  }
  const placeId = req.params.placeId;
  if (!mongoose.isValidObjectId(placeId)) {
    return res.status(400).send({
      err: "placeId is not a valid objectId !",
    });
  }

  if (!req.body.numberOfPeople) {
    return res.status(400).send({
      err: "Number of visitor is required !",
    });
  }
  if (!req.body.displayName) {
    return res.status(400).send({
      err: "Display name of visitor is required !",
    });
  }

  //   isUser
  //   user
  //   numberOfPeople
  //   preferedPlace
  //   displayName
  //   isDisplayName

  const waitingList = {
    isUser: false,
    numberOfPeople: req.body.numberOfPeople,
    preferedPlace: req.body.preferedPlace ? req.body.preferedPlace : null,
    displayName: req.body.displayName,
    isDisplayName: true,
  };

  if (!waitingList.preferedPlace) {
    delete waitingList.preferedPlace;
  }

  Place.findOneAndUpdate(
    { _id: placeId, owner: req.user._id },
    {
      $push: {
        waitingList: {
          $each: [waitingList],
        },
      },
    },
    {
      new: true,
    }
  )
    .then((place) => {
      if (!place) {
        throw {
          message: "No place with this id !",
        };
      }
      res.status(200).send({
        waitingList: place.waitingList,
        message: `${place.type} with name " ${place.name} " has been updated successfully !!`,
      });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.post(
  "/owner/removeFromWaitingList/:placeId",
  authenticate,
  (req, res) => {
    if (!req.params.placeId) {
      return res.status(400).send({
        err: "placeId is required !",
      });
    }
    const placeId = req.params.placeId;
    if (!mongoose.isValidObjectId(placeId)) {
      return res.status(400).send({
        err: "placeId is not a valid objectId !",
      });
    }

    if (!req.body.waitingId) {
      return res.status(400).send({
        err: "Choose one from the guests you added !",
      });
    }
    Place.findOne({ _id: placeId, owner: req.user._id })
      .then(async (place) => {
        if (!place) {
          throw {
            message: "No place with this id !",
          };
        }
        const guest = await place.waitingList.filter(
          (el) => el._id == req.body.waitingId
        )[0];
        if (!guest) {
          throw {
            message: "The waiting id is not correct !",
          };
        }
        if (guest.isUser) {
          throw {
            message: "You can not remove a user !",
          };
        }
        return Place.findOneAndUpdate(
          { _id: placeId, owner: req.user._id },
          {
            $pull: {
              waitingList: {
                _id: req.body.waitingId,
              },
            },
          },
          {
            new: true,
          }
        );
      })
      .then((place) => {
        res.status(200).send({
          waitingList: place.waitingList,
          message: `${place.type} with name " ${place.name} " has been updated successfully !!`,
        });
      })
      .catch((err) => {
        res.status(400).send({
          err: err.message ? err.message : err,
        });
      });
  }
);

router.post("/owner/popFromWaitingList/:placeId", authenticate, (req, res) => {
  if (!req.params.placeId) {
    return res.status(400).send({
      err: "placeId is required !",
    });
  }
  const placeId = req.params.placeId;
  if (!mongoose.isValidObjectId(placeId)) {
    return res.status(400).send({
      err: "placeId is not a valid objectId !",
    });
  }

  // if (!req.body.waitingId) {
  //   return res.status(400).send({
  //     err: "Choose one from the guests you added !",
  //   });
  // }

  if (
    !req.body.attendance ||
    !["attended", "missed"].includes(req.body.attendance)
  ) {
    return res.status(400).send({
      err: "Choose one from attendance type either attended or missed !",
    });
  }

  Place.findOne({ _id: placeId, owner: req.user._id })
    .then(async (place) => {
      if (!place) {
        throw {
          message: "No place with this id !",
        };
      }
      if (place.waitingList.length === 0) {
        throw {
          message: "The waiting list is already empty !!",
        };
      }
      const guest = await place.waitingList[0];
      if (guest.isUser) {
        let userObj;
        await User.findById(guest.user._id).then((rr) => {
          userObj = rr;
        });
        const isInWaitingHistory = userObj.waitingListHistory
          .map((el) => el.place)
          .includes(placeId);
        if (isInWaitingHistory) {
          const waitingListHistory = {
            place: placeId,
            rating: req.body.rating ? req.body.rating : -1,
            comment: req.body.comment ? req.body.comment : null,
            attendance: req.body.attendance,
            name: place.name,
          };
          const numberToBeDivideWith = waitingListHistory.rating < 0 ? 0 : 1;
          if (waitingListHistory.rating < 0) {
            waitingListHistory.rating = 0;
          }
          if (!waitingListHistory.comment) {
            delete waitingListHistory.comment;
            // send email to the user
            await User.findByIdAndUpdate(guest.user._id, {
              $pull: {
                waitingLists: place._id,
              },
            });
            switch (waitingListHistory.attendance) {
              case "attended":
                await User.findOneAndUpdate(
                  {
                    _id: guest.user._id,
                    "waitingListHistory.place": waitingListHistory.place,
                  },
                  {
                    $inc: {
                      "waitingListHistory.$.attendance.attended": 1,
                      "waitingListHistory.$.rating": waitingListHistory.rating,
                      "waitingListHistory.$.ratingDivider": numberToBeDivideWith,
                    },
                    $set: {
                      "waitingListHistory.$.name": waitingListHistory.name,
                    },
                  }
                );
                break;

              case "missed":
                await User.findOneAndUpdate(
                  {
                    _id: guest.user._id,
                    "waitingListHistory.place": waitingListHistory.place,
                  },
                  {
                    $inc: {
                      "waitingListHistory.$.attendance.missed": 1,
                      "waitingListHistory.$.rating": waitingListHistory.rating,
                      "waitingListHistory.$.ratingDivider": numberToBeDivideWith,
                    },
                    $set: {
                      "waitingListHistory.$.name": waitingListHistory.name,
                    },
                  }
                );
                break;

              default:
                break;
            }
          } else {
            // send email to the user
            await User.findByIdAndUpdate(guest.user._id, {
              $pull: {
                waitingLists: place._id,
              },
            });
            switch (waitingListHistory.attendance) {
              case "attended":
                await User.findOneAndUpdate(
                  {
                    _id: guest.user._id,
                    "waitingListHistory.place": waitingListHistory.place,
                  },
                  {
                    $inc: {
                      "waitingListHistory.$.attendance.attended": 1,
                      "waitingListHistory.$.rating": waitingListHistory.rating,
                      "waitingListHistory.$.ratingDivider": numberToBeDivideWith,
                    },
                    $push: {
                      "waitingListHistory.$.comments":
                        waitingListHistory.comment,
                    },
                    $set: {
                      "waitingListHistory.$.name": waitingListHistory.name,
                    },
                  }
                );
                break;

              case "missed":
                await User.findOneAndUpdate(
                  {
                    _id: guest.user._id,
                    "waitingListHistory.place": waitingListHistory.place,
                  },
                  {
                    $inc: {
                      "waitingListHistory.$.attendance.missed": 1,
                      "waitingListHistory.$.rating": waitingListHistory.rating,
                      "waitingListHistory.$.ratingDivider": numberToBeDivideWith,
                    },
                    $push: {
                      "waitingListHistory.$.comments":
                        waitingListHistory.comment,
                    },
                    $set: {
                      "waitingListHistory.$.name": waitingListHistory.name,
                    },
                  }
                );
                break;

              default:
                break;
            }
          }
        } else {
          const waitingListHistory = {
            place: placeId,
            rating: req.body.rating ? req.body.rating : 0,
            comments: req.body.comment ? [req.body.comment] : [],
            attendance: {
              attended: req.body.attendance === "attended" ? 1 : 0,
              left: req.body.attendance === "left" ? 1 : 0,
              missed: req.body.attendance === "missed" ? 1 : 0,
            },
            name: place.name,
          };
          await User.findByIdAndUpdate(
            guest.user._id,
            {
              $push: {
                waitingListHistory,
              },
            },
            { new: true }
          );
        }
      }
      return Place.findOneAndUpdate(
        { _id: placeId, owner: req.user._id },
        {
          $pop: {
            waitingList: -1,
          },
        },
        {
          new: true,
        }
      );
    })
    .then((place) => {
      res.status(200).send({
        waitingList: place.waitingList,
        message: `${place.type} with name " ${place.name} " has been updated successfully !!`,
      });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.post("/owner/delayInWaitingList/:placeId", authenticate, (req, res) => {
  if (!req.params.placeId) {
    return res.status(400).send({
      err: "placeId is required !",
    });
  }
  const placeId = req.params.placeId;
  if (!mongoose.isValidObjectId(placeId)) {
    return res.status(400).send({
      err: "placeId is not a valid objectId !",
    });
  }

  if (!req.body.waitingId) {
    return res.status(400).send({
      err: "Choose one from the guests you added !",
    });
  }

  if (!req.body.delayNumber || req.body.delayNumber < 0) {
    return res.status(400).send({
      err: "Delay number is required and must be more than 0!",
    });
  }

  Place.findById(placeId)
    .then(async (place) => {
      if (!place) {
        throw {
          message: "No place with this id !",
        };
      }

      const isInWaitingList = await place.waitingList.filter(
        (el) => el._id == req.body.waitingId
      );

      if (isInWaitingList.length === 0) {
        throw {
          message: `The guest is not added in the waiting list.`,
        };
      }

      if (isInWaitingList[0].isUser) {
        throw {
          message: `User can not be delayed unless by him/her account.`,
        };
      }

      return Place.findOneAndUpdate(
        { _id: placeId },
        {
          $pull: {
            waitingList: {
              _id: req.body.waitingId,
            },
          },
        }
      );
    })
    .then(async (place) => {
      const isInWaitingList = await place.waitingList.filter(
        (el) => el._id == req.body.waitingId
      );

      if (isInWaitingList.length === 0) {
        throw {
          message: `The guest is not added in the waiting list.`,
        };
      }

      const index = await place.waitingList
        .map((el) => el._id)
        .indexOf(req.body.waitingId);

      let desiredIndex = index + req.body.delayNumber;

      if (desiredIndex < 0) {
        desiredIndex = 0;
      }

      if (place.waitingList.length - 1 < desiredIndex) {
        desiredIndex = place.waitingList.length - 1;
      }

      // console.log(index);
      // console.log(desiredIndex);

      return Place.findOneAndUpdate(
        { _id: placeId },
        {
          $push: {
            waitingList: {
              $each: [isInWaitingList[0]],
              $position: desiredIndex,
            },
          },
        },
        {
          new: true,
        }
      );
    })
    .then((place) => {
      res.status(200).send({
        waitingList: place.waitingList,
        message: `The guest was delayed in ${place.name}'s waiting list successfully !!`,
      });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.post(
  "/owner/incrementCounterList/:placeId",
  authenticate,
  (req, res) => {
    if (!req.params.placeId) {
      return res.status(400).send({
        err: "placeId is required !",
      });
    }
    const placeId = req.params.placeId;
    if (!mongoose.isValidObjectId(placeId)) {
      return res.status(400).send({
        err: "placeId is not a valid objectId !",
      });
    }

    Place.findOne({ _id: placeId, owner: req.user._id })
      .then((place) => {
        if (!place) {
          throw {
            message: "No place with this id !",
          };
        }
        console.log(place);
        if (place.counterList.counter === place.counterList.userslist.length) {
          throw {
            message: "No users in the list to increment the number",
          };
        }

        return Place.findOneAndUpdate(
          { _id: placeId, owner: req.user._id },
          {
            $inc: {
              "counterList.counter": 1,
            },
          },
          {
            new: true,
          }
        );
      })
      .then((place) => {
        console.log("test");
        console.log(place);
        res.status(200).send({
          counterList: place.counterList,
          message: `${place.type} with name " ${place.name} " has been updated successfully !!`,
        });
      })
      .catch((err) => {
        res.status(400).send({
          err: err.message ? err.message : err,
        });
      });
  }
);

// ****************************************************************************************************
//                                          customer
// ****************************************************************************************************

router.post("/customer/addToWaitingList/:placeId", authenticate, (req, res) => {
  if (!req.params.placeId) {
    return res.status(400).send({
      err: "placeId is required !",
    });
  }
  const placeId = req.params.placeId;
  if (!mongoose.isValidObjectId(placeId)) {
    return res.status(400).send({
      err: "placeId is not a valid objectId !",
    });
  }

  if (!req.body.numberOfPeople) {
    return res.status(400).send({
      err: "Number of visitor is required !",
    });
  }
  if (req.body.isDisplayName && !req.body.displayName) {
    return res.status(400).send({
      err: "Display name of visitor is required !",
    });
  }

  const waitingList = {
    isUser: true,
    user: req.user._id,
    numberOfPeople: req.body.numberOfPeople,
    preferedPlace: req.body.preferedPlace ? req.body.preferedPlace : null,
    displayName: req.body.isDisplayName ? req.body.displayName : null,
    isDisplayName: req.body.isDisplayName,
  };

  if (!waitingList.preferedPlace) {
    delete waitingList.preferedPlace;
  }

  if (!waitingList.displayName) {
    delete waitingList.displayName;
  }

  Place.findById(placeId)
    .then(async (place) => {
      if (!place) {
        throw {
          message: "No place with this id !",
        };
      }

      if (!place.openWaitinglist) {
        throw {
          message: `${place.name} still did not open the waiting list qeueue.`,
        };
      }

      if (place.stopWaitingList) {
        throw {
          message: `${place.name} currently not recieving new guests in the waiting list qeueue.`,
        };
      }

      const isInWaitingList = await place.waitingList.map((el) => {
        if (el.user) return el.user._id;
      });

      // console.log(place.waitingList);
      // console.log(req.user._id);
      // console.log(isInWaitingList);

      if (isInWaitingList.includes(req.user._id)) {
        throw {
          message: `You are already in the waiting list.`,
        };
      }

      return Place.findOneAndUpdate(
        { _id: placeId },
        {
          $push: {
            waitingList: {
              $each: [waitingList],
            },
          },
        },
        {
          new: true,
        }
      );
    })
    .then(async (place) => {
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          waitingLists: place._id,
        },
      });
      res.status(200).send({
        waitingList: place.waitingList,
        message: `You are added to ${place.name}'s waiting list successfully !!`,
      });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

router.post(
  "/customer/removeFromWaitingList/:placeId",
  authenticate,
  (req, res) => {
    if (!req.params.placeId) {
      return res.status(400).send({
        err: "placeId is required !",
      });
    }
    const placeId = req.params.placeId;
    if (!mongoose.isValidObjectId(placeId)) {
      return res.status(400).send({
        err: "placeId is not a valid objectId !",
      });
    }

    Place.findOneAndUpdate(
      { _id: placeId },
      {
        $pull: {
          waitingList: {
            user: {
              _id: req.user._id,
            },
          },
        },
      }
    )
      .then(async (place) => {
        if (!place) {
          throw {
            message: "No place with this id !",
          };
        }
        // console.log(req.user.waitingListHistory);
        const isInWaitingHistory = req.user.waitingListHistory
          .map((el) => el.place)
          .includes(placeId);
        if (isInWaitingHistory) {
          // console.log("innn");
          const waitingListHistory = {
            place: placeId,
            rating: req.body.rating ? req.body.rating : -1,
            comment: req.body.comment ? req.body.comment : null,
            attendance: "left",
            name: place.name,
          };

          const guestList = await place.waitingList.map((el) => {
            if (el.user) return el.user._id;
          });

          if (!guestList.includes(req.user._id))
            throw `You are already removed from waiting list successfully !!`;

          const numberToBeDivideWith = waitingListHistory.rating < 0 ? 0 : 1;
          if (waitingListHistory.rating < 0) {
            waitingListHistory.rating = 0;
          }
          if (!waitingListHistory.comment) {
            delete waitingListHistory.comment;
            // send email to the user
            return User.findOneAndUpdate(
              {
                _id: req.user._id,
                "waitingListHistory.place": waitingListHistory.place,
              },
              {
                $inc: {
                  "waitingListHistory.$.attendance.left": 1,
                  "waitingListHistory.$.rating": waitingListHistory.rating,
                  "waitingListHistory.$.ratingDivider": numberToBeDivideWith,
                },
                $set: {
                  "waitingListHistory.$.name": waitingListHistory.name,
                },
              },
              { new: true }
            );
          } else {
            // send email to the user
            return User.findOneAndUpdate(
              {
                _id: req.user._id,
                "waitingListHistory.place": waitingListHistory.place,
              },
              {
                $inc: {
                  "waitingListHistory.$.attendance.left": 1,
                  "waitingListHistory.$.rating": waitingListHistory.rating,
                  "waitingListHistory.$.ratingDivider": numberToBeDivideWith,
                },
                $push: {
                  "waitingListHistory.$.comments": waitingListHistory.comment,
                },
                $set: {
                  "waitingListHistory.$.name": waitingListHistory.name,
                },
              },
              { new: true }
            );
          }
        } else {
          const waitingListHistory = {
            place: placeId,
            rating: req.body.rating ? req.body.rating : 0,
            comments: req.body.comment ? [req.body.comment] : [],
            attendance: {
              attended: 0,
              left: 1,
              missed: 0,
            },
            name: place.name,
          };

          const guestList = await place.waitingList.map((el) => {
            if (el.user) return el.user._id;
          });

          if (!guestList.includes(req.user._id))
            throw `You are already removed from waiting list successfully !!`;

          return User.findByIdAndUpdate(
            req.user._id,
            {
              $push: {
                waitingListHistory,
              },
            },
            { new: true }
          );
        }
      })
      .then(async (user) => {
        await User.findByIdAndUpdate(req.user._id, {
          $pull: {
            waitingLists: placeId,
          },
        });
        res.status(200).send({
          waitingListHistory: user.waitingListHistory,
          message: `You are removed from waiting list successfully !!`,
        });
      })
      .catch((err) => {
        res.status(400).send({
          err: err.message ? err.message : err,
        });
      });
  }
);

router.post(
  "/customer/delayInWaitingList/:placeId",
  authenticate,
  (req, res) => {
    if (!req.params.placeId) {
      return res.status(400).send({
        err: "placeId is required !",
      });
    }
    const placeId = req.params.placeId;
    if (!mongoose.isValidObjectId(placeId)) {
      return res.status(400).send({
        err: "placeId is not a valid objectId !",
      });
    }

    if (!req.body.delayNumber || req.body.delayNumber < 0) {
      return res.status(400).send({
        err: "Delay number is required and must be more than 0!",
      });
    }

    Place.findById(placeId)
      .then(async (place) => {
        if (!place) {
          throw {
            message: "No place with this id !",
          };
        }

        const isInWaitingList = await place.waitingList.filter((el) => {
          if (el.user) {
            return el.user + "" === req.user._id + "";
          }
        });

        if (isInWaitingList.length === 0) {
          throw {
            message: `You are not added in the waiting list.`,
          };
        }

        return Place.findOneAndUpdate(
          { _id: placeId },
          {
            $pull: {
              waitingList: {
                user: {
                  _id: req.user._id,
                },
              },
            },
          }
        );
      })
      .then(async (place) => {
        const isInWaitingList = await place.waitingList.filter((el) => {
          if (el.user) {
            return el.user + "" === req.user._id + "";
          }
        });

        if (isInWaitingList.length === 0) {
          throw {
            message: `You are not added in the waiting list.`,
          };
        }

        isInWaitingList.createdAt = moment().valueOf();

        const index = await place.waitingList
          .map((el) => (el.user ? el.user : null))
          .indexOf(req.user._id);

        let desiredIndex = index + req.body.delayNumber;

        if (desiredIndex < 0) {
          desiredIndex = 0;
        }

        if (place.waitingList.length - 1 < desiredIndex) {
          desiredIndex = place.waitingList.length - 1;
        }

        // console.log(index);
        // console.log(desiredIndex);

        return Place.findOneAndUpdate(
          { _id: placeId },
          {
            $push: {
              waitingList: {
                $each: [isInWaitingList[0]],
                $position: desiredIndex,
              },
            },
          },
          {
            new: true,
          }
        );
      })
      .then((place) => {
        res.status(200).send({
          waitingList: place.waitingList,
          message: `You are delayed in ${place.name}'s waiting list successfully !!`,
        });
      })
      .catch((err) => {
        res.status(400).send({
          err: err.message ? err.message : err,
        });
      });
  }
);

router.post("/customer/addToCounterList/:placeId", authenticate, (req, res) => {
  if (!req.params.placeId) {
    return res.status(400).send({
      err: "placeId is required !",
    });
  }
  const placeId = req.params.placeId;
  if (!mongoose.isValidObjectId(placeId)) {
    return res.status(400).send({
      err: "placeId is not a valid objectId !",
    });
  }

  Place.findById(placeId)
    .then(async (place) => {
      if (!place) {
        throw {
          message: "No place with this id !",
        };
      }

      if (!place.openCounterlist) {
        throw {
          message: `${place.name} still did not open the counter list qeueue.`,
        };
      }

      if (place.stopCounterList) {
        throw {
          message: `${place.name} currently not recieving new guests in the counter list qeueue.`,
        };
      }

      const isInCounterList = await place.counterList.userslist.map(
        (el) => el.user
      );

      if (isInCounterList.includes(req.user._id)) {
        throw {
          message: `You are already in the counter list.`,
        };
      }

      return Place.findOneAndUpdate(
        { _id: placeId },
        {
          $push: {
            "counterList.userslist": {
              $each: [
                {
                  user: req.user._id,
                },
              ],
            },
          },
        },
        {
          new: true,
        }
      );
    })
    .then(async (place) => {
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          counterLists: place._id,
        },
      });
      res.status(200).send({
        counterList: place.counterList,
        message: `You are added to ${place.name}'s waiting list successfully !!`,
      });
    })
    .catch((err) => {
      res.status(400).send({
        err: err.message ? err.message : err,
      });
    });
});

export const place = router;
