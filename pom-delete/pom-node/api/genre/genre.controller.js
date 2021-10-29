/*
 * Author: Anurag Tripathi
 * Description: this file contains all actions with respect to user's genre likeness values.
 * Date: May 26, 2021
 */
const UserGenre = require("../../models/user_genre.pgsql");
const user_calc = require("../../models/user_calc.pgsql");
const Util = require("../../services/utils");
const CONSTANT = require("../../config/constant").USER_MOOD;

/*
 * Author: Anurag Tripathi
 * Description: this funtions returns user's genre likeness value
 * Date: May 26, 2021
 */
const read = async function (req, res, next) {
  const userInfo = req.user;
  let query = {
    user_id: userInfo.data.userId,
  };
  try {
    const doc = await UserGenre.fetch(query);
    Util.successResponse(res, 200, doc);
  } catch (e) {
    Util.failureResponse(res, 500, "Unable to fetch list");
  }
};

/*
 * Author: Anurag Tripathi
 * Description: this function creates user's genre likeness value in db and calculate genremembership, extraversion score and fed to db for a user.
 * Date: May 26, 2021
 */
const create = async function (req, res, next) {
  const data = req.body;
  const userInfo = req.user;
  try {
    let doc = await UserGenre.upsert({
      user_id: userInfo.data.userId,
      vendor: Util.getCode(data.vendor, CONSTANT.VENDOR),
      genre_rating: data.genre_rating,
    });
    if (!doc) throw new Error("Invalid data");
    await user_calc.UserSpecificGenre(userInfo.data.userId)
    Util.successResponse(res, 200, doc);
  } catch (e) {
    Util.failureResponse(res, 500, "Invalid data");
  }
};

module.exports = {
  read,
  create,
};
