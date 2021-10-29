/*
 * Author: Shivam Singhal
 * Description: User Queries
 * Date: July 22, 2021
 */

const MAX_MATCHES_DAILY = 10

/*
 * Author: Shivam Singhal
 * Description: find all preferred matches for a user in cluster
 * Date: July 17, 2021
 */
const fetchPreferableMatchUsers = async (userId, clusterUserIds, userMap) => {
    
    const db = global.db

    console.log('Find: fetchPreferableMatchUsers')
    let [userPrefDoc, swipedDocs] = await Promise.all([
        getUserMatchPref(userId),
        db.query(`SELECT swipee FROM user_swipes WHERE swiper = ${userId}`, [])
    ])
    
    let canMatchUserIds = [...clusterUserIds]
    if (swipedDocs && swipedDocs.rows && swipedDocs.rows.length) {
        swipedDocs.rows.forEach((row, i) => {
            swipedDocs.rows[i] = row.swipee
        })
        swipedDocs = [...swipedDocs.rows, userId]
    } else swipedDocs = [userId]
    canMatchUserIds = canMatchUserIds.filter(n => !swipedDocs.includes(n))
    console.log('canMatchUserIds::', canMatchUserIds.length)

    let whereClause = `P.user_id IN (${canMatchUserIds.join(',')})`,
        whereLocationClause = '', whereGenderClause = '',
        whereAgeClause = `AND date_part('year', age(P.birth_date)) >= ${userPrefDoc.age_min || 18} 
            AND date_part('year', age(P.birth_date)) <= ${userPrefDoc.age_max || 100}`

    if (userPrefDoc.longitude && userPrefDoc.latitude && userPrefDoc.location_radius)
        whereLocationClause = `AND point(${userPrefDoc.longitude}, ${userPrefDoc.latitude})<@>point(MP.longitude, MP.latitude) < ${userPrefDoc.location_radius}`
    
    if (userPrefDoc.prefered_gender !== null && userPrefDoc.prefered_gender !== undefined)
        whereGenderClause = `AND P.gender = ${userPrefDoc.prefered_gender}`

    userPrefDoc.location_radius = 1609.344 * (userPrefDoc && userPrefDoc.location_radius || 0)
    let query = `CREATE EXTENSION IF NOT EXISTS earthdistance;
    SELECT P.user_id as user_id
        FROM profiles AS P 
        INNER JOIN match_preferences AS MP 
            ON MP.user_id = P.user_id
        WHERE ${whereClause} ${whereLocationClause} ${whereGenderClause} ${whereAgeClause}`
    //console.log('query for user: ', userId, ' :: ', query)
    let preferedUserList = await db.query(query)
    preferedUserList = preferedUserList && preferedUserList[1] && preferedUserList[1].rows && preferedUserList[1].rows.map(row => row.user_id) || []
    console.log('preferedUserList::', preferedUserList.length)
    
    let cUser = userMap[userId],
        normalisedMembership = [cUser.rock, cUser.classical, cUser.pop, cUser.rap, cUser.electronic].map(v => v * 5 / 7),
        userVector = [...normalisedMembership, (cUser.extra_version / 7), ((1 - cUser.extra_version) / 7)]

    let preferedUserPerceivedAttractiveness = [] 
    preferedUserList.forEach(preferedUser => {
        let pUser = userMap[preferedUser],
            tM = timeMultiplyer(pUser)
        const matchVector = [pUser.rock_score, pUser.classical_score, pUser.pop_score, pUser.rap_score, pUser.elctronic_score, pUser.extroverted, pUser.introverted]
        let G = dotProduct(userVector, matchVector) * tM / absolute(matchVector)
        let F = (cUser.extra_version * pUser.extroverted) +  (pUser.introverted + (1 - cUser.extra_version) )
        let pA = ( (0.8 * G)  + (0.2 * F) ) * tM //overall perceived attractiveness
        let probabilityInsertionVal = probabilityInsertion(pUser.swipes)
        preferedUserPerceivedAttractiveness.push([preferedUser, pA, probabilityInsertionVal])
    })
    preferedUserPerceivedAttractiveness = preferedUserPerceivedAttractiveness.sort((a, b) => a[1] > b[1])
    let top20 = preferedUserPerceivedAttractiveness.splice(0, parseInt(preferedUserPerceivedAttractiveness.length *.2)),
        bottom80 = preferedUserPerceivedAttractiveness
    let list = []
    top20.forEach(tuple => {
        if (list.length < MAX_MATCHES_DAILY && tuple[2] > Number.EPSILON)
            list.push(tuple[0]) 
    })
    bottom80.forEach(tuple => {
        if (list.length < MAX_MATCHES_DAILY && tuple[2] > Number.EPSILON)
            list.push(tuple[0]) 
    })
    console.log('Calculations for user done::', list)
    return list
}

const timeMultiplyer = userCalcDoc => (0.9 / (1 + (userCalcDoc.l / (45 - userCalcDoc.l)) ** 3 ) + 0.1)

const dotProduct = (userVector, matchVector) => userVector.reduce((a, u, i) => a + u * matchVector[i], 0)

const absolute = vector => Math.sqrt(vector.reduce((a, v, i) => a + v*v, 0))

const probabilityInsertion = s => 0.5 - Math.max( 0.01 * s, 0.1 ) +  ( 0.1 * Math.sin( s / 4 ))

const getUserMatchPref = async userId => {
    
    const db = global.db

    let results = await db.query(`SELECT * FROM match_preferences WHERE user_id = ${userId}`, [])
    return results && results.rows && results.rows[0] || {}
}

module.exports = {
    getUserMatchPref,
    fetchPreferableMatchUsers,
}