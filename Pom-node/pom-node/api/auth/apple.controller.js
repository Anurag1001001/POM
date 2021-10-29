/*
 * Author: Anurag Tripathi
 * Description: this file contains all actions with respect to apple music authentication
 * Date: May 25, 2021
 */

module.exports.login = function (req, res, next) {
  res.render("index", {
    teamID: process.env.TEAMID,
    devToken: global.TokenData,
  });
};

module.exports.accessToken = function (req, res, next) {
  res.render("token", { teamID: process.env.TEAMID });
};
