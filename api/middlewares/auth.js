import { authJWT } from "../services";
import { errorName } from "../constants";
import { sendError } from "../factories";

export const authorize = (userTypes) => (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const { _id, userType, roles } = authJWT(token);
    if (
      ["user", "employee", "customer"].filter((usertype) =>
        req.originalUrl.includes(usertype)
      ).length > 0 &&
      !req.body._id
    )
      req.body._id = _id;
    req.user._id = _id;
    if (userTypes.includes(userType)) next();
    else if (
      userType === "employee" &&
      roles.filter((role) => userTypes.includes(role)).length > 0
    )
      next();
    else throw new Error(errorName.UNAUTHORIZED);
  } catch (error) {
    sendError(res, error);
  }
};
