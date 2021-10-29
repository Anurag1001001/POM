const UserCalc = require('./user_calc.pgsql')

const Bookshelf = global.Bookshelf;

const UserSwipe = Bookshelf.model("UserSwipe", {
  tableName: "user_swipes",
});
const UserMatchResult = Bookshelf.model("UserMatchResult", {
  tableName: "user_match_results",
});


/*
 * Author: Anurag Tripathi
 * Description: insert/update swiper-swipee doc and update liked_count, liked_me_count on each swipe. 
 * Date: July 22, 2021
 */
const like = async (data) => {
  if (!data.swipee || !data.swiper) return false
  let method = "insert",
    query = new UserSwipe({
      swiper: data.swiper,
      swipee: data.swipee
    });
  let doc = await query.fetch({ require: false });
  if (doc) {
    method = "update";
    data.id = doc.id;
  }
  let result = await UserSwipe.forge(data).save(null, { method });

  // update liked_count, liked_me_count on each swipe. 
  await UserCalc.updateSwipeCount({
    swiperId: data.swiper,
    swipeeId: data.swipee,
    action: data.action
  })
  return result;
}

/*
 * Author: Anurag Tripathi
 * Description: insert/update swiper-swipee doc and update disliked_count, disliked_me_count on each swipe. 
 * Date: July 22, 2021
 */
const disLike = async (data) => {
  if (!data.swipee || !data.swiper) return false
  let method = "insert",
    query = new UserSwipe({
      swiper: data.swiper,
      swipee: data.swipee
    });
  let doc = await query.fetch({ require: false });
  if (doc) {
    method = "update";
    data.id = doc.id;
  }
  let result = await UserSwipe.forge(data).save(null, { method });

  // update disliked_count, disliked_me_count on each swipe. 
  await UserCalc.updateSwipeCount({
    swiperId: data.swiper,
    swipeeId: data.swipee
  })
  return result;
}

/*
 * Author: Anurag Tripathi
 * Description: returns list of swipee that has been swiped bby user on current day
 * Date: July 22, 2021
 */
const getSwipesToday  = async (userId) => {
  let qb = UserMatchResult.query();
  let result = await qb.where('user_id', '=', userId)
      .andWhere('EXTRACT(EPOCH from created_at)', '>', 'EXTRACT(EPOCH FROM current_date - 1)')
      .select('target_id');
  const swipee = result.map(item => item.target_id)
  return swipee
}

const getAllSwipes = async (userId) => {
  const query = new UserMatchResult({
      user_id: userId
    });
  let doc = await query.fetch({ require: false });
  return doc
}
module.exports = {
  like,
  disLike,
  getSwipesToday,
  getAllSwipes
}