/*
 * Author: Shivam Singhal
 * Description: axios function to make request to algo service api
 * Date: July 27, 2021
 */
const axios = require("axios");

module.exports.updateScore = async data => {
  try {
    let conf = {}
    conf.method = "GET"
    conf.url = '/algo/score?swipee='+data.swipee+'&swiper='+data.swiper+'&action='+data.action
    conf.baseURL = process.env.ALGO_BASEURL
    let response = await axios(conf)
    return response
  } catch (error) {
    return error.response
  }
}

module.exports.firstTimeMatch = async userId => {
  try {
    let conf = {}
    conf.method = "GET"
    conf.url = '/match/fresh?userId='+userId
    conf.baseURL = process.env.ALGO_BASEURL
    let response = await axios(conf)
    return response.data
  } catch (error) {
    return error.response
  }
}