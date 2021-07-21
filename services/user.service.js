const courseModel = require("../models/course.model");
const userModel = require("../models/user.model")

module.exports = {
    async getUserInfo(id) {
        var user = await userModel.single(id);
        delete user.password;
        delete user.refresh_token;
        delete user.email;
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
    async getUsersByRole(role){
        var users = await userModel.getUsersByRole(role);
        users.map((c) => {
            delete c.password;
            delete c.refresh_token;
        });
        return users;
    }
}