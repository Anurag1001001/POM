const UserMood = require("../models/user_mood.pgsql");
const UserExtension = require("../models/user_extension.pgsql");


module.exports =  async () => {
  const avgExtraVersionScore = await UserMood.computeExtraversionScoreOfUser(119)
  const result = await UserExtension.create({
    user_id: 119,
    k_rating: 0,
    extra_version_score: 0.26
  })
  console.log(result)
}