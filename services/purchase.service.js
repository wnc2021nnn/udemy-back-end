const { v4 } = require("uuid");
const eventEmitter = require("../handlers/listeners/event-listener");
const purchaseModel = require("../models/purchase.model");

module.exports = {
    async createAPurchase(purchase) {
        await purchaseModel.add(purchase);
        //Add log
        const log = {};
        log['log_id'] = v4();
        log['target_id'] = purchase.item_id;
        log['data'] = purchase;
        log['user_id'] = purchase.user_id;
        log['type'] = 'COURSE_REGISTED';
        log['created_at'] = purchase.created_at;

        eventEmitter.emit('COURSE_REGISTED', log);
    }
}