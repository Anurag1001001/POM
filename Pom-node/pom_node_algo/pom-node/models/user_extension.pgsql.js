const Bookshelf = global.Bookshelf;

const UserExtension = Bookshelf.model("UserExtension", {
  tableName: "user_extension",
});


const create = async (data) => {
  if (!data.user_id) return false;
  if (!data.extra_version_score) return false;
  let method = "insert",
    query = new UserExtension({ user_id: data.user_id }),
    doc = await query.fetch({ require: false });
  if (doc) {
    method = "update";
    data.id = doc.id;
  }
  let result = await UserExtension.forge(data).save(null, { method });
  return result;
};

module.exports = {
  create
};
