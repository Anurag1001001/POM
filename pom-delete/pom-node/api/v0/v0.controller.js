/*
 * Author: Anurag Tripathi
 * Description: this file contains based on dart api methods.
 * Date: May 25, 2021
 */
const path = require("path");
const { getToken } = require("apple-music-token-node");
const Util = require("../../services/utils");
const UserSwipe = require("../../models/user_swipes.pgsql");
const DartApi = require("../../services/dart.api");
const UserMatchToday = require("../../models/user_match_today.pgsql")
const CONSTANT = require("../../config/constant").USER_MOOD;
const AlgoSvc = require('../../services/algo.api')

/*
 * Author: Anurag Tripathi
 * Description: this function redirect to apple music login.
 * Date: May 26, 2021
 */

module.exports.appleMusicLogin = function (req, res, next) {
  const ValidPath = path.resolve(__dirname, "../../privateKey.p8");
  const TokenData = getToken(
    ValidPath,
    process.env.TEAMID,
    process.env.KEYID,
    4380
  );
  res.render("index", {
    teamID: process.env.TEAMID,
    devToken: TokenData,
  });
};

/*
 * Author: Anurag Tripathi
 * Description: this function return the apple music token to app
 * Date: May 26, 2021
 */
module.exports.appleMusicAccessToken = function (req, res, next) {
  res.render("token", { teamID: process.env.TEAMID });
};

/*
 * Author: Anurag Tripathi
 * Description: this function returns all the get response
 * Date: May 25, 2021
 */
const getData = async (req, res, next) => {
  try {
    let conf = {};
    conf.method = "GET";
    conf.headers = cleansHeaders(req.headers);
    conf.url = req.url;
    conf.query = req.query;
    let response = await DartApi(conf);
    if (next === 'no_response') return 
    Util.successResponse(res, response.status, response.data);
  } catch (error) {
    if (next === 'no_response') return
    Util.response(res, error.status, error.message);
  }
};
module.exports.getData = getData

/*
 * Author: Anurag Tripathi
 * Description: this function creates data into database
 * Date: May 25, 2021
 */
module.exports.postData = async (req, res, next) => {
  try {
    let conf = {};
    conf.method = "POST";
    conf.headers = cleansHeaders(req.headers);
    conf.url = req.url;
    conf.query = req.query;
    conf.data = req.body;
    let response = await DartApi(conf);
    Util.successResponse(res, response.status, response.data);
  } catch (error) {
    Util.response(res, error.status, error.message);
  }
};

/*
 * Author: Anurag Tripathi
 * Description: this function updates data into database
 * Date: May 25, 2021
 */

module.exports.putData = async (req, res, next) => {
  try {
    let conf = {}
    conf.method = "PUT";
    conf.headers = cleansHeaders(req.headers);
    conf.url = req.url;
    conf.query = req.query;
    conf.data = req.body;
    let response = await DartApi(conf);
    Util.successResponse(res, response.status, response.data);
  } catch (error) {
    Util.response(res, error.status, error.message);
  }
};

/*
 * Author: Anurag Tripathi
 * Description: this function delete data into database
 * Date: May 25, 2021
 */
module.exports.deleteData = async (req, res, next) => {
  try {
    let conf = {}
    conf.method = "DELETE";
    conf.headers = cleansHeaders(req.headers);
    conf.url = req.url;
    conf.query = req.query;
    conf.body = req.body;
    let response = await DartApi(conf);
    Util.successResponse(res, response.status, response.data);
  } catch (error) {
    Util.response(res, error.status, error.message);
  }
};

/*
 * Author: Anurag Tripathi
 * Description: insert/update swiper-swipee doc and update liked_count, liked_me_count on each swipe and return limit .
 * Date: July 22, 2021
 */
module.exports.userLike = async (req, res) => {
  try {
    await getData(req, res, 'no_response') 
    let results = await UserMatchToday.remainingMatches(req.user.data.userId)
    await AlgoSvc.updateScore({
      swipee: parseInt(req.params.id),
      swiper: req.user.data.userId,
      action: CONSTANT.ACTION.LIKE
    })
    Util.successResponse(res, 200, {limit: results.length});
  }
  catch (e) {
    Util.failureResponse(res, 500, "Invalid data");
  }
}

/*
 * Author: Anurag Tripathi
 * Description: insert/update swiper-swipee doc and update disliked_count, disliked_me_count on each swipe and return limit.
 * Date: July 22, 2021
 */
module.exports.userDisLike = async (req, res) => {
  try {
    await getData(req, res, 'no_response')
    let results = await UserMatchToday.remainingMatches(req.user.data.userId)
    await AlgoSvc.updateScore({
      swipee:  parseInt(req.params.id),
      swiper: req.user.data.userId,
      action: CONSTANT.ACTION.DISLIKE
    })
    Util.successResponse(res, 200, {limit: results.length});
  }
  catch (e) {
    Util.failureResponse(res, 500, "Invalid data");
  }
}

/*
 * Author: Anurag Tripathi
 * Description: returns list of remaining matches and matches_like_limit
 * Date: July 22, 2021
 */
module.exports.todayMatch = async (req, res)=>{
  const userId = req.user.data.userId
  let results = await UserMatchToday.remainingMatches(userId)
  if (!results.length) {
    let hasSwiped = await UserSwipe.getAllSwipes(userId)
    if (!hasSwiped) {
      results = await AlgoSvc.firstTimeMatch(userId)
      results = results.data
    }
  }
  Util.successResponse(res, 200, {matches_ids: results.map(String), matches_like_limit: results.length})
}

const cleansHeaders = (headers) => {
  let tempHeaders = Object.assign({}, headers);
  delete tempHeaders["user-agent"];
  delete tempHeaders["host"];
  return tempHeaders;
};
