/*
 * Author: Anurag Tripathi
 * Description: this files contains instance of UserMood table and associated queries
 * Date: May 25, 2021
 */
const Bookshelf = global.Bookshelf;

const UserMood = Bookshelf.model("UserMood", {
  tableName: "user_moods",
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

module.exports = {
  list,
  upsert,
  remove,
};
