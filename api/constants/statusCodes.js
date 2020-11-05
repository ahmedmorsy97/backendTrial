export const errorName = {
  UNKNOWN: "UNKNOWN",
  UNAUTHORIZED: "UNAUTHORIZED",
  UNAUTHENTICATED: "UNAUTHENTICATED",
  UNIQUEEMAIL: "UNIQUEEMAIL",
  INVALIDEMAILORPASSWORD: "INVALIDEMAILORPASSWORD",
  LOGGEDOUTUSER: "LOGGEDOUTUSER",
  LOGGEDINUSER: "LOGGEDINUSER",
  VALIDATION: "VALIDATION",
  ENTITYNOTFOUND: "ENTITYNOTFOUND",
  EMPTYMESSAGE: "EMPTYMESSAGE",
  IMAGESNOTFOUND: "IMAGESNOTFOUND",
  EMAILNOTCONFIRMED: "EMAILNOTCONFIRMED",
};

export const errorType = {
  UNKNOWN: {
    message: "Unkown error.",
    statusCode: "E000",
  },
  UNAUTHORIZED: {
    message: "Authorization is needed to get requested response.",
    statusCode: "E001",
  },
  UNAUTHENTICATED: {
    message: "Authentication is needed to get requested response.",
    statusCode: "E002",
  },
  UNIQUEEMAIL: {
    message: "This email has already been taken. Please try different one",
    statusCode: "E003",
  },
  INVALIDEMAILORPASSWORD: {
    message: "Incorrect email or password. Please try again.",
    statusCode: "E004",
  },
  LOGGEDOUTUSER: {
    message: "You must be signed in.",
    statusCode: "E005",
  },
  LOGGEDINUSER: {
    message: "You are already signed in.",
    statusCode: "E006",
  },
  VALIDATION: {
    message: "Validation error.",
    statusCode: "E007",
  },
  ENTITYNOTFOUND: {
    message: "Entity not found.",
    statusCode: "E008",
  },
  EMPTYMESSAGE: {
    message: "Message body is empty",
    statusCode: "E009",
  },
  IMAGESNOTFOUND: {
    message: "Couldnot find images on cloudinary and the item is removed.",
    statusCode: "E008",
  },
  EMAILNOTCONFIRMED: {
    message: "Please confirm your email first before logging-in.",
    statusCode: "E009",
  },
};
