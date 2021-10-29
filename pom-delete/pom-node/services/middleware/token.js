/*
 * Author: Anurag Tripathi
 * Description: this functions verify user's access token
 * Date: May 25, 2021
 */

const jwt = require("jsonwebtoken");
const Util = require("../utils");

module.exports.verify = (req, res, next) => {
  const token = req.headers["authorization"].replace("Bearer ", "");
  if (!token) return res.status(401).json("Unauthorize user");
  try {
    const decodedPayload = jwt.verify(token, process.env.SECRETKEY);
    req.user = decodedPayload;
    next();
  } catch (e) {
    Util.failureResponse(res, 400, "Token not valid");
    return;
  }
};
