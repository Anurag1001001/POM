/*
 * Author: Anurag Tripathi
 * Description: this files contains instance of user_genre table and associated queries
 * Date: May 26, 2021
 */
const Bookshelf = global.Bookshelf;

const UserGenre = Bookshelf.model("UserGenre", {
  tableName: "user_genres",
});

/*
 * Author: Anurag Tripathi
 * Description: this funtions returns user's genre likeness value
 * Date: May 26, 2021
 */

const fetch = async (data) => {
  let query = new UserGenre({ data });
  let doc = await query.fetch();
  return doc;
};

/*
 * Author: Anurag Tripathi
 * Description: this function creates user's genre likeness value in db
 * Date: May 26, 2021
 */
const upsert = async (data) => {
  if (!data.user_id) return false;
  if (!data.vendor) return false;
  if (!data.genre_rating) return false;
  let method = "insert",
    query = new UserGenre({ user_id: data.user_id }),
    doc = await query.fetch({ require: false });
  if (doc) {
    method = "update";
    data.id = doc.id;
  }
  let result = await UserGenre.forge(data).save(null, { method });
  return result;
};

/*
 * Author: Anurag Tripathi
 * Description: returns topThreeGenre of user.
 * Date: July 26, 2021
 */
const topThreeGenre = async (userId) => {
  const result = await UserGenre.where('user_id', userId).fetch({require: false,columns:["genre_rating"]})
  const genre = []
  if(result){
  const data = result.attributes.genre_rating.data
  data.forEach((item) => {
    genre.push(item.key.toUpperCase())
  })
}
  return genre
}

module.exports = {
  fetch,
  upsert,
  topThreeGenre
};
