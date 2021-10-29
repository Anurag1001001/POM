/*
 * Author: Anurag Tripathi
 * Description: this files contains instance of User table and associated queries
 * Date: May 25, 2021
 */
const Bookshelf = global.Bookshelf;

const User = Bookshelf.model("User", {
  tableName: "users",
});

/*
 * Author: Anurag Tripathi
 * Description: this function authenticates user based on id
 * Date: May 25, 2021
 */
const authenticate = async (id) => {
  let query = new User({ id });
  let doc = await query.fetch();
  return doc;
};

module.exports = {
  authenticate,
};
