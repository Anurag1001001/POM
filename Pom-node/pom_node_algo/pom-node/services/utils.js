/*
 * Author: Anurag Tripathi
 * Description: this files contains some common utility functions
 * Date: May 25, 2021
 */

const response = (res, code, data) => {
  res.status(code).send(data);
};

const successResponse = (res, code = 200, data) => {
  let result = data
  if (typeof data === 'number') {
    result = `${data}`
  }
  res.status(code).send(result);
};

const failureResponse = (res, code = 400, message) => {
  res.status(code).send(message);
};

const checkError = (response) => {
  if (!(response.status && response.data)) {
      const err = new Error(`${response.response.statusText}`)
      err.status = response.response.status
      err.message = response.response.data
      throw err
  }
}

const getCode = (str, constObj = {}) => {
  if (!str) return undefined;
  return constObj[str.toUpperCase()];
};
module.exports = {
  successResponse,
  failureResponse,
  response,
  getCode,
  checkError,
};
