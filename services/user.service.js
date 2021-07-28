const { v4 } = require("uuid");
const bcrypt = require('bcrypt');
const courseModel = require("../models/course.model");
const userModel = require("../models/user.model");
const otpService = require("./otp.service");
const eventEmitter = require('../handlers/listeners/event-listener')

module.exports = {
    async createUser(user) {
        user.password = bcrypt.hashSync(user.password, 10);
        user.user_id = v4();
        user.created_at = Date.now();
        user.state = 'ENABLED';
        //await userModel.add(user);

        delete user.password;

        const otp = await otpService.createOtp();

        user.otp = otp;

        eventEmitter.emit('USER_REGISTED', user);

        return user;
    },

    async getUserInfo(id) {
        var user = await userModel.single(id);
        delete user.password;
        delete user.refresh_token;
        if (user.role == 1) { //1 Teacher
            const courses = await courseModel.getCouresByTeacherId(user.user_id);
            user.courses_count = courses.length;
            const students_count = courses.reduce((pre, cur) => {
                return {
                    'registed_count': Number(pre.registed_count) + Number(cur.registed_count),
                };
            }).registed_count;
            user.students_count = students_count;
        }
        return user;
    },
    async getUsersByRole(role) {
        var users = await userModel.getUsersByRole(role);
        users.map((c) => {
            delete c.password;
            delete c.refresh_token;
        });
        return users;
    },
    async deleteUsers(userIds) {
        var res = await userModel.setUsersState(userIds, 'DISABLED');
        return res;
    }
}