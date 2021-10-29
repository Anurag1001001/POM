/*
 * Author: Shivam Singhal
 * Description: Algorithm for generating user's match for the day
 * Date: July 15, 2021
 */

const Util = require("../../services/utils"),
    KMeansUtil = require("../../services/kmeans.utils"),
    EloUtil = require('../../services/elo.utils')

const CONSTANTS = require("../../config/constant")

const UserCalc = require('../../models/user_calc.pgsql'),
    User = require('../../models/user.pgsql')

/*
 * Author: Shivam Singhal
 * Description: initiate algorithm for user match preferences
 * Date: July 16, 2021
 */

const initiate = async (req, res) => {
    
    if (res) Util.successResponse(res, 200, {})
    
    const db = global.db
    
    console.log('Drop Table temp_user_match_today')
    await db.query('DROP TABLE IF EXISTS temp_user_match_today', [])
    console.log('Create Table temp_user_match_today')
    await db.query(`CREATE TABLE IF NOT EXISTS temp_user_match_today (
        id serial PRIMARY KEY,
        user_id INT,
        matches JSON
     )`, [])
     
    //phase 1
    console.log('Phase I started')
    let rows = await UserCalc.fetchGenreMembershipExtraversion(),
        clusteredUsersMap = await KMeansUtil.getUserDistanceMap(rows)
    
    //phase 2
    //traverse for each user in cluster against every other user in same cluster 
    //find matches based on preference
    //reorder them by perceived attractiveness
    console.log('Phase II started')
    for (let clusterId of Object.keys(clusteredUsersMap)) {
        let clusterUsers = Object.keys(clusteredUsersMap[clusterId])
        console.log('Cluster #',clusterId, ' started, no. of users in this cluster ', clusterUsers.length)
        for (let userId of clusterUsers) {
            console.log('************* Cluster:', clusterId,'***** User', userId, '***************')
            let list = await User.fetchPreferableMatchUsers(userId, clusterUsers, clusteredUsersMap[clusterId])
            //save data in temp_user_match_today
            await db.query(`INSERT INTO temp_user_match_today(user_id, matches) VALUES (${userId}, '${JSON.stringify(list)}')`, [])
        }
    }

    //rename user_match_today => user_match_today_temp
    console.log('Change Table user_match_today => user_match_today_temp')
    await db.query('ALTER TABLE IF EXISTS user_match_today RENAME TO user_match_today_temp', [])
    //save in temp_user_match_today => user_match_today
    console.log('Change Table temp_user_match_today => user_match_today')
    await db.query('ALTER TABLE IF EXISTS temp_user_match_today RENAME TO user_match_today', [])
    //drop user_match_today_temp
    console.log('Drop Table temp_user_match_today_temp')
    await db.query('DROP TABLE IF EXISTS user_match_today_temp', [])

    //phase 3
    //while swiping, scoring method below
    console.log('Phase III to be handled in real time while app is being used by users')
    console.log('All phases complete for algo')
}

/*
 * Author: Shivam Singhal
 * Description: initiate algorithm for user match preferences
 * Date: July 16, 2021
 */

const score = async (req, res) => {
    
    const db = global.db

    let {swiper, swipee, action} = req.query || {}
    if (!swipee || !swiper || !action) {
        Util.successResponse(res, 200, {})
        return
    }
    console.log('swiper', swiper, 'swipee', swipee, 'action', action)

    let [swiperDoc, swipeeDoc] = await Promise.all([
        UserCalc.fetchGenreMembershipExtraversionByUserId(swiper), 
        UserCalc.fetchGenreMembershipExtraversionByUserId(swipee)
    ])
    console.log('swiperDoc:: ', JSON.stringify(swiperDoc))
    console.log('swipeeDoc:: ', JSON.stringify(swipeeDoc))

    action = action == CONSTANTS.USER_MOOD.ACTION.LIKE
    console.log('action:: ', action)

    const baseK = swiperDoc.o < 30 ?  30 :
        swiperDoc.o > swipeeDoc.o ? 15 : 10
    console.log('baseK:: ', baseK)
    
    let swiperVector = [swiperDoc.rock_score, swiperDoc.classical_score, swiperDoc.pop_score, swiperDoc.rap_score, swiperDoc.electronic_score, swiperDoc.extroverted, swiperDoc.introverted],
        swipeeVector = [swipeeDoc.rock_score, swipeeDoc.classical_score, swipeeDoc.pop_score, swipeeDoc.rap_score, swipeeDoc.electronic_score, swipeeDoc.extroverted, swipeeDoc.introverted],
        swiperMembership = [
            swiperDoc.r * 5 / 7, 
            swiperDoc.c * 5 / 7, 
            swiperDoc.p * 5 / 7, 
            swiperDoc.a * 5 / 7, 
            swiperDoc.e * 5 / 7, 
            swiperDoc.v / 7, 
            (1-swiperDoc.v) / 7
        ]
    
    swipeeVector = swipeeVector.map((v, i) => EloUtil.calculateScore(v, swiperVector[i], action, swiperMembership[i] * baseK * 7))
    console.log('swipeeVector:: ', swipeeVector.toString())
    //update user_calc of swipee
    await UserCalc.updateScores(swipee, swipeeVector)
    console.log('Scores of swipee updated')
    Util.successResponse(res, 200, {})
}


module.exports = {
    initiate,
    score
}