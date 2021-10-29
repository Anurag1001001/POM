/*
 * Author: Anurag Tripathi
 * Description: this files contains instance of UserMood table and associated queries
 * Date: May 25, 2021
 */
const Bookshelf = global.Bookshelf;

const Emotions = Bookshelf.model("Emotions", {
  tableName: "emotions"
});

const UserMood = Bookshelf.model("UserMood", {
  tableName: "user_moods",
  emotions() {
    return this.belongsTo('Emotions', 'mood_id')
  }
});

/*
 * Author: Anurag Tripathi
 * Description: this funtions returns list of user's data based on moods, vendor, type
 * Date: May 25, 2021
 */

const list = async (data) => {
  let query = new UserMood({ data });
  let docs = await query.fetchAll();
  return docs;
};

/*
 * Author: Anurag Tripathi
 * Description: this function creates list of data based on user's mood
 * Date: May 25, 2021
 */

const upsert = async (data) => {
  if (!data.vendor) return false;
  if (!data.user_id) return false;
  if (!data.mood_id) return false;
  if (!data.type) return false;
  if (!data.vendor_type_id) return false;
  let method = "insert",
    query = new UserMood({
      vendor: data.vendor,
      user_id: data.user_id,
      type: data.type,
      vendor_type_id: data.vendor_type_id,
    });
  let doc = await query.fetch({ require: false });
  if (doc) {
    method = "update";
    data.id = doc.id;
  }
  let result = await UserMood.forge(data).save(null, { method });
  return result;
};

const remove = async (id) => {
  let query = new UserMood({ id });
  let result = await query.destroy({ require: false });
  return result;
};
const computeExtraversionScoreOfUser = async (userId) => {
  const result = await UserMood.where('user_id', userId).fetchAll({withRelated: [{
    'emotions': (qb) => {
      qb.select('id', 'extra_version')
    }
  }]})
  let extraVersionScore = 0
  result.models.forEach((model) => {
    extraVersionScore += parseFloat(model.related('emotions').attributes.extra_version)
  })
  const avgExtraVersionScore = extraVersionScore/result.models.length
  return avgExtraVersionScore
}

/*
 * Author: Anurag Tripathi
 * Description: returns moodGenre of user.
 * Date: July 26, 2021
 */
const moodGenre = async (userId) => {
  const result = await UserMood.where('user_id', userId).fetchAll({columns:["doc"]})
  let genreList = []
  
  result.models.forEach(model => {
    if (model && model.attributes && model.attributes.doc && model.attributes.doc.genres) 
    genreList = [...genreList, ...model.attributes.doc.genres]
    if (model && model.attributes && model.attributes.doc && model.attributes.doc.genreNames) 
      genreList = [...genreList, ...model.attributes.doc.genreNames]
  })
  return genreList
}


module.exports = {
  list,
  upsert,
  remove,
  computeExtraversionScoreOfUser,
  moodGenre
};
