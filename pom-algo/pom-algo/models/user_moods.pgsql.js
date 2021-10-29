/*
 * Author: Shivam Singhal
 * Description: User Mood Queries
 * Date: July 20, 2021
 */

const CONSTANTS = require('../config/constant')

/*
 * Author: Shivam Singhal
 * Description: find user's genre membership, extraversion score
 * Date: July 20, 2021
 */

const getGenreMembershipAndExtraversionScoreByUserId = async userId => {
    console.log('getGenreMembershipAndExtraversionScoreByUserId---:: ', userId)
    const db = global.db
    
    let [userMoodDocs, userGenreDocs] = await Promise.all([
            db.query(`SELECT * FROM user_moods INNER JOIN emotions ON emotions.id = user_moods.mood_id WHERE user_id = ${userId}`, []),
            db.query(`SELECT * FROM user_genres WHERE user_id = ${userId}`, [])
        ]),
        genres = [], evtmp = 0, genreMap = {rock: 0, classical: 0, pop: 0, rap: 0, electronic: 0}

    userMoodDocs = userMoodDocs.rows
    userGenreDocs = userGenreDocs.rows
    
    userMoodDocs.forEach(userMoodDoc => {
        evtmp += parseFloat(userMoodDoc.extra_version)
        if (userMoodDocs && userMoodDocs.genres && userMoodDocs.genres.length)
            genres = [...genres, userMoodDocs.genres]
        if (userMoodDocs && userMoodDocs.genreNames && userMoodDocs.genreNames.length)
            genres = [...genres, userMoodDocs.genreNames]
    })
    
    userGenreDocs.forEach(userGenreDoc => {
        if (!(userGenreDoc && userGenreDoc.genre_rating && userGenreDoc.genre_rating.data && userGenreDoc.genre_rating.data.length)) 
            return
        if (!Array.isArray(userGenreDoc.genre_rating.data)) 
            return
        userGenreDoc.genre_rating.data.forEach(d => {
            genres.push(d.key)
            if (genreMap[d.key.toLowerCase()])
                genreMap[d.key.toLowerCase()] = d.weight || 0
        })
    })
    
    genres.forEach(genre => {
        genreMap[CONSTANTS.GENRE_MAP[genre.toUpperCase()]]++
    })

    evtmp = evtmp/(userMoodDocs && userMoodDocs.length || 1)

    let total = genreMap.rock + genreMap.classical + genreMap.pop + genreMap.rap + genreMap.electronic
    total = total || 1
    genreMap.rock = Math.round(genreMap.rock/total * 100) / 100
    genreMap.classical = Math.round(genreMap.classical/total * 100) / 100
    genreMap.pop = Math.round(genreMap.pop/total * 100) / 100
    genreMap.rap = Math.round(genreMap.rap/total * 100) / 100
    genreMap.electronic = Math.round(genreMap.electronic/total * 100) / 100

    await db.query(`INSERT INTO user_calc (user_id, rock, classical, pop, rap, electronic, extra_version) VALUES (${userId}, ${genreMap.rock}, ${genreMap.classical}, ${genreMap.pop}, ${genreMap.rap}, ${genreMap.electronic}, ${evtmp})`, [])
    return {
        extra_version: evtmp,
        ...genreMap
    }
}


module.exports = {
    getGenreMembershipAndExtraversionScoreByUserId,
}