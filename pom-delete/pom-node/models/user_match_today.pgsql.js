/*
 * Author: Anurag Tripathi
 * Description: this files contains instance of UserMood table and associated queries
 * Date: May 25, 2021
 */
const UserSwipe = require("./user_swipes.pgsql")
const Bookshelf = global.Bookshelf;
const UserMatchToday = Bookshelf.model("UserMatchToday", {
  tableName: "user_match_today"
});

/*
 * Author: Anurag Tripathi
 * Description: returns list of remaining matches
 * Date: July 22, 2021
 */
const remainingMatches = async (userId) => {
  let userMatchesTodayQuery = new UserMatchToday({
      user_id: userId,
  });
  let remainingMatches = []
  let userMatchesTodayDocs = await userMatchesTodayQuery.fetch({ require: false });
  let userSwipesTodayDocs = await UserSwipe.getSwipesToday(userId)
  if (!userMatchesTodayDocs || !userMatchesTodayDocs.attributes || !userMatchesTodayDocs.attributes.matches ) {
    userMatchesTodayDocs = []
  } else {
    userMatchesTodayDocs = userMatchesTodayDocs.attributes.matches
  }
  remainingMatches = userMatchesTodayDocs.filter(n => !userSwipesTodayDocs.includes(n))
  return remainingMatches;
}

module.exports = {
  remainingMatches
};
