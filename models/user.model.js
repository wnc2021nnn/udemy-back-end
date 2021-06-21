const db = require('../utils/db');
const TBL_USER = "user";
module.exports = {
    usersByUserIds(ids) {
        return db(TBL_USER).whereIn('user_id', ids);
    },

    //   all() {
    //     return db('users');
    //   },

    //   async single(id) {
    //     const users = await db('users').where('id', id);
    //     if (users.length === 0) {
    //       return null;
    //     }

    //     return users[0];
    //   },

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
