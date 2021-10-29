/*
 * Author: Anurag Tripathi
 * Description: this file contains all actions with respect to user's mood and it's crud.
 * Date: May 25, 2021
 */

const UserMood = require("../../models/user_mood.pgsql");
const UserExtension = require("../../models/user_extension.pgsql");
const Util = require("../../services/utils");
const CONSTANT = require("../../config/constant").USER_MOOD;

/*
 * Author: Anurag Tripathi
 * Description: this funtions returns list of user's data based on moods, vendor, type
 * Date: May 25, 2021
 */

const getList = async function (req, res, next) {
  const { mood_id, vendor, type } = req.query;
  const userInfo = req.user;
  let query = {
    user_id: userInfo.data.userId,
    mood_id: mood_id || undefined,
    vendor: Util.getCode(vendor || "", CONSTANT.VENDOR),
    type: Util.getCode(type || "", CONSTANT.TYPE),
  };
  try {
    const list = await UserMood.list(query);
    Util.successResponse(res, 200, list);
  } catch (e) {
    Util.failureResponse(res, 500, "Unable to fetch list");
  }
};

/*
 * Author: Anurag Tripathi
 * Description: this function creates list of data based on user's mood
 * Date: May 25, 2021
 */

const create = async function (req, res, next) {
  const data = req.body;
  const userInfo = req.user;
  try {
    let doc = await UserMood.upsert({
      user_id: userInfo.data.userId,
      mood_id: data.mood_id,
      vendor: Util.getCode(data.vendor, CONSTANT.VENDOR),
      type: Util.getCode(data.type, CONSTANT.TYPE),
      vendor_type_id: data.vendor_type_id,
      doc: data.doc,
    });
    if (!doc) throw new Error("Invalid data");

    const avgExtraVersionScore = await UserMood.computeExtraversionScoreOfUser(userInfo.data.userId)
    const result = await UserExtension.create({
      user_id: userInfo.data.userId,
      k_rating: 0,
      extra_version_score: avgExtraVersionScore
    })
    
    Util.successResponse(res, 200, doc);
  } catch (e) {
    Util.failureResponse(res, 500, "Invalid data");
  }
};

/*
 * Author: Anurag Tripathi
 * Description: this funtions delete data from database based on user's choice
 * Date: May 25, 2021
 */

const remove = async function (req, res, next) {
  const id = req.params.id;
  try {
    if (!id) throw new Error("Invalid data");
    const response = await UserMood.remove(id);
    if (!response) throw new Error("Unable to delete");
    Util.successResponse(res, 200, response);
  } catch (e) {
    Util.failureResponse(res, 500, "Unable to delete ");
  }
};

module.exports = {
  getList,
  create,
  remove,
};
