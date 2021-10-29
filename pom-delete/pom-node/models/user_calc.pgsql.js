const { moodGenre, computeExtraversionScoreOfUser } = require('./user_mood.pgsql') 
const { topThreeGenre } = require('./user_genre.pgsql');
const {USER_MOOD: CONSTANT, GENRE_MAP} = require("../config/constant");

const Bookshelf = global.Bookshelf;

const UserCalc = Bookshelf.model("UserCalc", {
  tableName: "user_calc",
});

/*
 * Author: Anurag Tripathi
 * Description: calculate genremembership, extraversion score and fed to db for a user.
 * Date: July 26, 2021
 */

const UserSpecificGenre = async (userId) => {
  if (!userId) return
  const map = GENRE_MAP
  const extra_version = await computeExtraversionScoreOfUser(userId)
  const moodGenreArray = await moodGenre(userId)
  const topThreeGenreArray = await topThreeGenre(userId)
  const UserGenreArray = moodGenreArray.concat(topThreeGenreArray)
  let genreMapping = {'rock': 0, 'classical': 0, 'pop': 0, 'rap': 0, 'electronic': 0}
  UserGenreArray.forEach((genre) => {
    if (genreMapping[map[genre]] !== undefined) {
      genreMapping[map[genre]] += 1
    }
  })
  for (const [key, value] of Object.entries(genreMapping)) {
    genreMapping[key] = Math.round(value/UserGenreArray.length*100)/100  
  }
  genreMapping.user_id = userId
  genreMapping.extra_version = extra_version
  let method = "insert",
    query = new UserCalc({ user_id: userId }),
    doc = await query.fetch({ require: false });
  if (doc) {
    method = "update";
    genreMapping.id = doc.id;
  }
  try {
    let result = await UserCalc.forge(genreMapping).save(null, { method });
    return result;
  } catch(error){
    console.log(error)
  }  
}

/*
 * Author: Anurag Tripathi
 * Description: Update last login of each user
 * Date: July 26, 2021
 */

const updateActiveTimestamp = async (userId) => {
  try {
    if(!userId) return
    let method = "insert",
    query = new UserCalc({ user_id: userId }),
    doc = await query.fetch({ require: false });
  if (doc) {
    method = "update";
  } else {
    doc =  {}
  }
  doc.user_id = userId
  doc.last_login = Math.round(Date.now()/1000)
  let result = await UserCalc.forge(doc).save(null, { method });
  return result
  } catch (err) {
    console.log(err.message)
  }
}

/*
 * Author: Anurag Tripathi
 * Description: Update liked_count, liked_me_count, disliked_count, disliked_me_count on basis of ACTION on each swipe. 
 * Date: July 22, 2021
 */
const updateSwipeCount = async (data) => {
  let swiperQuery = new UserCalc({ user_id: data.swiperId});
  let swipeeQuery = new UserCalc({ user_id: data.swipeeId});
  try {    
    const swiperDoc = await swiperQuery.fetch({ require: false });
    const swipeeDoc = await swipeeQuery.fetch({ require: false });
    if(data.action === CONSTANT.ACTION.LIKE) {
      swiperDoc.attributes.liked_count += 1 
      swipeeDoc.attributes.liked_me_count += 1
    } else if(data.action  === CONSTANT.ACTION.DISLIKE) {
      swiperDoc.attributes.disliked_count += 1 
      swipeeDoc.attributes.disliked_me_count += 1
    }
    await UserCalc.forge(swiperDoc.attributes).save(null, { method: "update" });
    await UserCalc.forge(swipeeDoc.attributes).save(null, { method: "update" });
  } catch (error) {
    return error
  }
}
module.exports = {
  UserSpecificGenre,
  updateActiveTimestamp,
  updateSwipeCount
}
