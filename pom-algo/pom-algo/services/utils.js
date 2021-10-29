/*
 * Author: Shivam Singhal
 * Description: common app utility
 * Date: July 11, 2021
 */

/*
 * Author: Shivam Singhal
 * Description: send response back to client
 * Date: July 11, 2021
 */
const response = (res, code, data) => {
  res.status(code).send(data);
}

/*
 * Author: Shivam Singhal
 * Description: send success response back to client
 * Date: July 11, 2021
 */
const successResponse = (res, code = 200, data) => {
  let result = data
  if (typeof data === 'number') {
    result = `${data}`
  }
  res.status(code).send(result);
}

/*
 * Author: Shivam Singhal
 * Description: send failure response back to client
 * Date: July 11, 2021
 */
const failureResponse = (res, code = 400, message) => {
  res.status(code).send(message);
}

module.exports = {
  successResponse,
  failureResponse,
  response,
}