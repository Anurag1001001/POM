/*
 * Author: Shivam Singhal
 * Description: User Calc Queries
 * Date: July 15, 2021
 */

const UserMood = require('../models/user_moods.pgsql')

/*
 * Author: Shivam Singhal
 * Description: find all users genre membership, extraversion score
 * Date: July 17, 2021
 */

const LIMIT = 1000

const fetchGenreMembershipExtraversion = async () => {
    
    const db = global.db

    let rows = []
    console.log('****fetchGenreMembershipExtraversion****')
    let countUserCalc = await db.query(
        `SELECT COUNT(id) AS row_count 
        FROM user_calc`, [])
    
    countUserCalc = countUserCalc.rows[0].row_count
    console.log('Total rows:: ', countUserCalc)
    let loopUserCalc = Math.ceil(countUserCalc/LIMIT)
    console.log('Total loops:: ', loopUserCalc)
    loopUserCalc = Array(loopUserCalc).keys()
    for (const i of loopUserCalc) {
        let res = await db.query(
            `SELECT 
                user_calc.user_id AS user_id, 
                rock, classical, pop, rap, electronic, 
                extra_version,
                ((extract(epoch from now()) - last_login) / 86400)::INTEGER AS last_login,
                (liked_count + disliked_count) AS i_liked,
                (liked_me_count + disliked_me_count) AS others_liked,
                extroverted, introverted,
                attractiveness,
                rock_score, classical_score, pop_score, rap_score, electronic_score,
                coalesce(S.swipes, 0) AS swipes
            FROM user_calc
			LEFT JOIN (
                SELECT 
                    COUNT(id) AS swipes, 
                    swiper as user_id 
                FROM user_swipes 
                WHERE 
                    timestamp > EXTRACT(EPOCH FROM current_date - 1) 
                GROUP BY swiper
            ) AS S 
                ON S.user_id = user_calc.user_id
            ORDER BY user_calc.id ASC 
            LIMIT ${LIMIT} 
            OFFSET ${i*LIMIT}`)
        rows = [...rows, ...res.rows]
        console.log('loop:: ', i, ' Rows fetched:: ', res.rows.length, ' Total rows fetched:: ', rows.length)
    }

    let countNotCalcUsers = await db.query(
        `SELECT DISTINCT t1.user_id AS user
        FROM user_moods AS t1 
        LEFT JOIN user_calc AS t2 
            ON t1.user_id = t2.user_id 
        WHERE t2.user_id IS NULL`, [])
    
    countNotCalcUsers = countNotCalcUsers && countNotCalcUsers.rows || [] 
    
    console.log('Count of users not found in user_calc:: ', countNotCalcUsers.length)
    
    for (let {user: userId} of countNotCalcUsers) {
        let res = await UserMood.getGenreMembershipAndExtraversionScoreByUserId(userId)
        rows.push({
            user_id: userId,
            //genre memberships
            rock: res.rock,
            classical: res.classical,
            pop: res.pop,
            rap: res.rap,
            electronic: res.electronic,
            //extraversion
            extra_version: res.extra_version,
            last_login: 0, //last since used
            //i: i liked, o: others liked me
            i_liked: 0,
            others_liked: 0,
            //extrovert, introvert, attractiveness
            extroverted: 0,
            introverted: 0,
            attractiveness: 0,
            //genre swipe scores
            rock_score: 0,
            classical_score: 0,
            pop_score: 0,
            rap_score: 0,
            electronic_score: 0,
            //swipes yesterday
            swipes: 0
        })
    }
    console.log('Total users to work on::', rows.length)
    return rows
}

/*
 * Author: Shivam Singhal
 * Description: find user's genre membership, extraversion score
 * Date: July 22, 2021
 */
const fetchGenreMembershipExtraversionByUserId = async userId => {
    
    const db = global.db

    let docs = await db.query(`SELECT 
    user_calc.user_id AS user_id, 
    rock, classical, pop, rap, electronic, extra_version,
    ((extract(epoch from now()) - last_login) / 86400)::INTEGER AS last_login,
    (liked_count + disliked_count) AS i_liked,
    (liked_me_count + disliked_me_count) AS others_liked,
    extroverted, introverted, attractiveness,
    rock_score, classical_score, pop_score, rap_score, electronic_score,
    coalesce(S.swipes, 0) AS swipes
    FROM user_calc
    LEFT JOIN (
        SELECT 
            COUNT(id) AS swipes, 
            swiper as user_id 
        FROM user_swipes 
        WHERE 
            timestamp > EXTRACT(EPOCH FROM current_date - 1) 
        GROUP BY swiper
    ) 
        AS S ON S.user_id = user_calc.user_id
    WHERE user_calc.user_id = ${userId}`, [])
    return docs && docs.rows && docs.rows[0]
}

/*
 * Author: Shivam Singhal
 * Description: update scores of user based on elo, post swipes
 * Date: July 22, 2021
 */
const updateScores = async (userId, swipeeVector) => {
    
    const db = global.db

    await db.query(`UPDATE user_calc 
        SET
            rock_score = ${swipeeVector[0]}, 
            classical_score = ${swipeeVector[1]}, 
            pop_score = ${swipeeVector[2]}, 
            rap_score = ${swipeeVector[3]}, 
            electronic_score = ${swipeeVector[4]},
            extroverted = ${swipeeVector[5]}, 
            introverted  = ${swipeeVector[6]}
        WHERE 
            user_id = ${userId}
    `, [])
    return
}

/*
 * Author: Shivam Singhal
 * Description: find top score users from each genre
 * Date: July 24, 2021
 */
const findTopGenreUsers = async (genre, limit, userPrefDoc) => {
    
    const db = global.db

    let whereClause = `${genre}_score >=  0`,
        whereLocationClause = '', whereGenderClause = '',
        whereAgeClause = `AND date_part('year', age(P.birth_date)) >= ${userPrefDoc.age_min || 18} 
            AND date_part('year', age(P.birth_date)) <= ${userPrefDoc.age_max || 100}`

    if (userPrefDoc.longitude && userPrefDoc.latitude && userPrefDoc.location_radius)
        whereLocationClause = `AND point(${userPrefDoc.longitude}, ${userPrefDoc.latitude})<@>point(MP.longitude, MP.latitude) < ${(userPrefDoc.location_radius || 0) * 1600}`
    
    if (userPrefDoc.prefered_gender !== null && userPrefDoc.prefered_gender !== undefined)
        whereGenderClause = `AND P.gender = ${userPrefDoc.prefered_gender}`

    let results = await db.query(`CREATE EXTENSION IF NOT EXISTS earthdistance;
       SELECT 
            UC.user_id AS user_id,
            coalesce(S.swipes, 0) AS swipes 
        FROM user_calc AS UC
        LEFT JOIN (
            SELECT 
                COUNT(id) AS swipes, 
                swiper as user_id 
            FROM user_swipes 
            WHERE 
                timestamp > EXTRACT(EPOCH FROM current_date - 1) 
            GROUP BY swiper
        ) AS S 
            ON S.user_id = UC.user_id
        LEFT JOIN match_preferences AS MP
            ON MP.user_id = UC.user_id
        LEFT JOIN profiles AS P
            ON P.user_id = UC.user_id
        WHERE ${whereClause} ${whereLocationClause} ${whereGenderClause} ${whereAgeClause}
        ORDER BY ${genre}_score DESC 
        LIMIT ${limit}
    `)
    results = results && results[1] && results[1].rows && results[1].rows.map(row => [row.user_id, row.swipes])
    results = results || []
    return results
}

module.exports = {
    fetchGenreMembershipExtraversion,
    fetchGenreMembershipExtraversionByUserId,
    updateScores,
    findTopGenreUsers
}