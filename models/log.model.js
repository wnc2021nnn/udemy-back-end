const db = require('../utils/db');
const TBL_LOG = 'log'

module.exports = {
    add(type, logId, targetId, data, createdAt) {
        return db(TBL_LOG).insert({
            "type": type,
            "log_id": logId,
            "target_id": targetId,
            "data": data,
            "created_at": createdAt,
        });
    }
}