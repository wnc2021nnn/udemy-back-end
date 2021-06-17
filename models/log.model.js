const db = require('../utils/db');
const TBL_LOG = 'log'

module.exports = {
    add(type, logId, targetId, data, createdAt, userId) {
        return db(TBL_LOG).insert({
            "type": type,
            "log_id": logId,
            "target_id": targetId,
            "data": data,
            "created_at": createdAt,
            "user_id": userId
        });
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