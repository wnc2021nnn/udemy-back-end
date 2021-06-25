const db = require('../utils/db');
const TBL_LOG = 'log'

module.exports = {
    add(log) {
        return db(TBL_LOG).insert(log);
    },

    coursesRegistedWithInCount(timeInMiliseconds) {
        return db(TBL_LOG).select({
            course_id: 'target_id',
            // registed_times: 'count',
        }).count().where({
            type: "COURSE_REGISTED"
        }).andWhere(function () {
            this.where('created_at', '>=', timeInMiliseconds)
        }).groupBy('target_id').orderBy('count', 'desc');
    },

    coursesViewedWithInCount(timeInMiliseconds) {
        return db(TBL_LOG).select({
            course_id: 'target_id',
        }).count().where({
            type: "USER_VIEW_COURSE"
        }).andWhere(function () {
            this.where('created_at', '>=', timeInMiliseconds)
        }).groupBy('target_id').orderBy('count', 'desc');
    }
}