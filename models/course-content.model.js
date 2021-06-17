const db = require('../utils/db');
const TBL_COURSE_CONTENT = 'course_content'

module.exports = {
    all() {
        return db(TBL_COURSE_CONTENT);
    },
}