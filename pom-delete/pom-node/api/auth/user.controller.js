/*
 * Author: Anurag Tripathi
 * Description: this function checks authentication of user
 * Date: May 25, 2021
 */

const User = require("../../models/user.pgsql");
const UserCalc = require("../../models/user_calc.pgsql")
const Util = require("../../services/utils");

module.exports.validate = async (req, res) => {
  const userInfo = req.user;
  try {
    let data = await User.authenticate(userInfo.data.userId);
    if (!data) throw new Error("unauthorised user");
    Util.successResponse(res, 200, data);
  } catch (err) {
    Util.failureResponse(res, 500, "unauthorised user");
  }
};
module.exports.activeTimestamp = async (req, res) => {
  const userInfo = req.user;
  try {
    const result = await UserCalc.updateActiveTimestamp(userInfo.data.userId)
    Util.successResponse(res, 200, result);
  } catch (err) {
    Util.failureResponse(res, 500, "unauthorised user");
  }
};