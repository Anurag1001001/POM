/*
 * Author: Anurag Tripathi
 * Description: axios function to make request to dart api
 * Date: May 25, 2021
 */
const axios = require("axios");

module.exports = async conf => {
  try {
    conf.baseURL = process.env.DART_BASEURL;
    let response = await axios(conf);
    return response;
  } catch (error) {
    return error.response;
  }
};
