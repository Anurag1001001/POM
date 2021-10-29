/*
 * Author: Shivam Singhal
 * Description: Elo Utility 
 * Date: July 23, 2021
 */

const EloRating = require('elo-rating')

/*
 * Author: Shivam Singhal
 * Description: fetching user's centroid and its distance
 * Date: July 24, 2021
 */
const calculateScore = (swipeeScore, swiperScore, win, k) => {
    let result = EloRating.calculate(swipeeScore, swiperScore, win, k)
    return result.playerRating
}

module.exports = {
    calculateScore
}