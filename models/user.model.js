const db = require('../utils/db');
const TBL_USER = "user";
module.exports = {
  usersByUserIds(ids) {
    return db(TBL_USER).whereIn('user_id', ids);
  },

  //   all() {
  //     return db('users');
  //   },

  async single(id) {
    const users = await db(TBL_USER).where('user_id', id);
    if (users.length === 0) {
      return null;
    }

    return users[0];
  },

  getUsersByRole(role) {
    return db(TBL_USER)
      .where(
        'role', role
      );
  },

  async singleByEmail(email) {
    const users = await db(TBL_USER).where('email', email);
    if (users.length === 0) {
      return null;
    }

    return users[0];
  },

  add(user) {
    return db(TBL_USER).insert(user);
  },

  patchPassword(id, password) {
    return db(TBL_USER).where('user_id', id).update('password', password);
  },

  patchUsername(id, firstName, lastName) {
    return db(TBL_USER).where('user_id', id).update({
      "first_name": firstName,
      "last_name": lastName,
    });
  },

  patchRFToken(id, rfToken) {
    return db(TBL_USER).where('user_id', id).update('refresh_token', rfToken);
  },

  async isValidRFToken(id, rfToken) {
    const list = await db(TBL_USER).where('user_id', id).andWhere('refresh_token', rfToken);
    if (list.length > 0) {
      return true;
    }

    return false;
  }
};
