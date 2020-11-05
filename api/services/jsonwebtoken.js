import jwt from "jsonwebtoken";
import { secretOrPrivateKey } from "../../configs";

export const jsonwebtoken = (payload, options) => {
  try {
    return jwt.sign(payload, secretOrPrivateKey, options);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const authJWT = (token) => {
  try {
    return jwt.verify(token, secretOrPrivateKey);
  } catch (error) {
    throw new Error(error.message);
  }
};
