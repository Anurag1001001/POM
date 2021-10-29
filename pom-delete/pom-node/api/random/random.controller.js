/*
 * Author: Deepak Tuli
 * Description: Health Check API
 * Date: July 20, 2021
 */
const Util = require("../../services/utils");

const healthCheck = async function (req, res, next) {
  Util.successResponse(res, 200, 'ok1');
};

module.exports = {
  healthCheck
};
