/*
 * Author: Shivam Singhal
 * Description: Algorithm for generating user's match for the day
 * Date: July 24, 2021
 */

const Util = require("../../services/utils")

const UserCalc = require('../../models/user_calc.pgsql'),
    User = require('../../models/user.pgsql')

/*
 * Author: Shivam Singhal
 * Description: initiate algorithm for user match preferences
 * Date: July 24, 2021
 */

const fresh = async (req, res) => {
    
    const db = global.db

    let {userId} = req.query

    if (!userId) {
        Util.successResponse(res, 200, [])
        return
    }

    let [userCalcDoc, userPrefDoc] = await Promise.all([
        UserCalc.fetchGenreMembershipExtraversionByUserId(userId),
        User.getUserMatchPref(userId)
    ])
    console.log('userCalcDoc::', userCalcDoc)
    console.log('userPrefDoc::', userPrefDoc)
    let promises = [],
        USER_TO_FIND = 30

    if (userCalcDoc.rock) promises.push(UserCalc.findTopGenreUsers('rock', USER_TO_FIND, userPrefDoc))
    
    if (userCalcDoc.classical) promises.push(UserCalc.findTopGenreUsers('classical', USER_TO_FIND, userPrefDoc))
    
    if (userCalcDoc.pop) promises.push(UserCalc.findTopGenreUsers('pop', USER_TO_FIND, userPrefDoc))
    
    if (userCalcDoc.rap) promises.push(UserCalc.findTopGenreUsers('rap', USER_TO_FIND, userPrefDoc))
    
    if (userCalcDoc.electronic) promises.push(UserCalc.findTopGenreUsers('electronic', USER_TO_FIND, userPrefDoc))
    
    let results = await Promise.all(promises)
    console.log('results:: ', results)
    let users = [], matches = []

    results && results.forEach(result => {
        users = [...users, ...result]
    })
    users = Array.from(new Set(users))
    console.log('users:: ', users.toString())

    const probabilityInsertion = s => 0.5 - Math.max( 0.01 * s, 0.1 ) +  ( 0.1 * Math.sin( s / 4 ))

    users.map(user => {
        if (matches.length < USER_TO_FIND && probabilityInsertion(user[1]) > Number.EPSILON)
        matches.push(user[0])
    })
    console.log('matches:: ', matches.toString())
    matches = matches.slice(0, USER_TO_FIND)
    //save data in temp_user_match_today
    await db.query(`INSERT INTO user_match_today(user_id, matches) VALUES (${userId}, '${JSON.stringify(matches)}')`, [])
    console.log('Matches inserted in user_match today')
    Util.successResponse(res, 200, {data: matches})
}

module.exports = {
    fresh
}