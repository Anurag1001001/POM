/*
 * Author: Anurag Tripathi
 * Description: this file contains based on dart api methods.
 * Date: May 25, 2021
 */

const Util = require("../../services/utils");
const DartApi = require("../../services/dart.api");

/*
 * Author: Anurag Tripathi
 * Description: this function redirect to apple music login.
 * Date: May 26, 2021
 */

module.exports.appleMusicLogin = function (req, res, next) {
  res.render("index", {
    teamID: process.env.TEAMID,
    devToken: global.TokenData,
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
module.exports.getData = async (req, res, next) => {
  try {
    let conf = {};
    conf.method = "GET";
    conf.headers = cleansHeaders(req.headers);
    conf.url = req.url;
    conf.query = req.query;
    let response = await DartApi(conf);
    Util.successResponse(res, response.status, response.data);
  } catch (error) {
    Util.response(res, error.status, error.message);
  }
};

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

const cleansHeaders = (headers) => {
  let tempHeaders = Object.assign({}, headers);
  delete tempHeaders["user-agent"];
  delete tempHeaders["host"];
  return tempHeaders;
};
