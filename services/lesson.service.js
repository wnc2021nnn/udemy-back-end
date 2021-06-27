const { v4 } = require('uuid');
const lessonLearningStateModel = require('../models/lesson-learning-state.model');
const lessonModel = require('../models/lesson.model')
module.exports = {
    async updateVideoLearningState(learningState) {
        const isStateExist = await lessonLearningStateModel.isExist(learningState.user_id, learningState.lesson_id);
        const now = Date.now();
        if (!isStateExist) {
            learningState = {
                ...learningState,
                "created_at": now,
                "updated_at": now,
                "id": v4(),
            }
            await lessonLearningStateModel.add(learningState);
        } else {
            learningState = {
                ...learningState,
                "updated_at": now,
            }
            await lessonLearningStateModel.updateLearningTime(learningState);
            
        }
        return learningState;
    }
}