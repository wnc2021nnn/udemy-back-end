const topicModel = require('../models/topic.model')
const logModel = require('../models/log.model')
const courseModel = require('../models/course.model');
const purchaseModel = require('../models/purchase.model');
const chapterModel = require('../models/chapter.model');
const lessonModel = require('../models/lesson.model');
const lessonLearningStateModel = require('../models/lesson-learning-state.model');
const { v4 } = require('uuid');

module.exports = {
    async coursesViewedDesFromLastWeek(limit = 3) {
        const lastWeek = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const coursesViewLog = await logModel.coursesViewedWithInCount(lastWeek);
        const limitedCoursesViewLog = coursesViewLog.slice(0, limit);
        const ids = limitedCoursesViewLog.map((l) => l.course_id);
        const courses = await courseModel.getCouresByIds(ids);
        return courses.map((c) => {
            const view_count = coursesViewLog.find((t) => t.course_id === c.course_id).count;
            return {
                ...c,
                view_count
            }
        });
    },

    async increaseRegistedCountByOne(courseId) {
        const course = (await courseModel.getDetailCouresById(courseId))[0];
        if (course) {
            const registedCount = course.registed_count + 1;
            const result = await courseModel.updateRegistedCount(courseId, registedCount);
            return result;
        }
    },

    async increaseViewCountByOne(courseId) {
        const course = (await courseModel.getDetailCouresById(courseId))[0];
        if (course) {
            const viewCount = course.view_count + 1;
            const result = await courseModel.updateViewCount(courseId, viewCount);
            return result;
        }
    },

    async increaseReviewCountByOne(courseId, rating) {
        const course = (await courseModel.getDetailCouresById(courseId))[0];
        if (course) {
            const newRatingTotal = course.rating_total + 1;
            const newRating = ((course.rating ?? 0) * course.rating_total + rating) / newRatingTotal;
            const result = await courseModel.updateCourse(courseId, {
                'rating_total': newRatingTotal,
                'rating': newRating,
            });
            return result;
        }
    },

    async getMyCourses(user) {
        switch (user.role) {
            case 1: //teacher
                return await courseModel.getCouresByTeacherId(user.user_id);
                break;
            case 2: //student
                return await this.getUserPurchasedCourses(user.user_id);
                break;
            default:
                break;
        }
    },

    async getUserPurchasedCourses(userId) {
        const purchases = await purchaseModel.multiByUserIdAndType(userId, 'COURSE_PURCHASE');
        const courseIds = purchases.map((p) => p.item_id);
        const courses = await courseModel.getCouresByIds(courseIds);
        return courses;
    },

    async getChaptersAndLessonsByCourse(courseId, userId) {
        const chapters = await chapterModel.chaptersByCourse(courseId);
        const chapterIds = chapters.map((c) => c.chapter_id);
        var lessons = await lessonModel.lessonsByChapters(chapterIds);

        if (userId) {
            const lessonIds = lessons.map((l) => l.lesson_id);
            const states = await lessonLearningStateModel.getByLessonIdsAndUserId(lessonIds, userId);
            states.forEach((state) => {
                lessons = lessons.map((l) => {
                    if (state.lesson_id === l.lesson_id) {
                        l['current_video_secconds'] = state.current_video_secconds;
                        l['current_video_secconds_updated_at'] = state.updated_at;
                    }
                    return l;
                });
            });
        }

        return {
            chapters,
            lessons
        };
    },

    async createACourse(userId, userRole, course) {
        if (userRole != 1) throw 'You cannot create course';
        course.course_id = v4();
        course.lecturers_id = userId;
        const now = Date.now();
        course.created_at = now;
        course.updated_at = now;
        course.state = 'ENABLED';
        await courseModel.createCourse(course);
        return course;
    },

    async updateACourse(courseId, course) {
        const result = await courseModel.updateCourse(courseId, course);
        return result;
    },

    async searchCourse(query, page, limit, sortBy, sortDir) {
        const listCourse = await courseModel.searchCourse(query, page, limit, sortBy, sortDir);
        const result = {
            'data': listCourse,
            'pagination': {
                'total_courses': listCourse.length,
            }
        }

        if (page && limit) {
            const length = (await courseModel.searchCourse(query)).length;
            result.pagination = {
                'total_courses': length,
            }
        }
        return result;
    }
}
