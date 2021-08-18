const request = require('request');
// Response helper
const { createCoursesButtonsTemplate,
    createCategoryButtonsTemplate,
    createTopicsButtonsTemplate,
    createViewCourseDetailsButtonsTemplate } = require("../utils/webhook-response-helper")

// Model
const categoryModel = require("../models/category.model");
const courseModel = require("../models/course.model");
const topicModel = require('../models/topic.model');

//Number items of list
const CHUNK = 3;

// Handles messages events
async function handleMessage(senderPsid, receivedMessage) {
    let response;
    // Checks if the message contains text
    if (receivedMessage.text) {
        // Create the payload for a basic text message, which
        // will be added to the body of your request to the Send API
        // Search
        const courseList = await courseModel.searchCourse(receivedMessage.text);
        if (courseList.length > 0) {
            for (let i = 0; i < courseList.length; i += CHUNK) {
                const chunkCourseList = courseList.slice(i, i + CHUNK);
                response = createCoursesButtonsTemplate(`Các khóa học liên quan đến: ${receivedMessage.text}`, chunkCourseList);
                callSendAPI(senderPsid, response);
                console.log("Response of search: " + JSON.stringify(response));
            }
            return;
        }
        else response = { "text": "Không có khóa học nào, vui lòng thử lại!" }
    } else if (receivedMessage.attachments) {

        // Get the URL of the message attachment
        // let attachmentUrl = receivedMessage.attachments[0].payload.url;
        // response = {
        //     'attachment': {
        //         'type': 'template',
        //         'payload': {
        //             'template_type': 'generic',
        //             'elements': [{
        //                 'title': 'Is this the right picture?',
        //                 'subtitle': 'Tap a button to answer.',
        //                 'image_url': attachmentUrl,
        //                 'buttons': [
        //                     {
        //                         'type': 'postback',
        //                         'title': 'Yes!',
        //                         'payload': 'yes',
        //                     },
        //                     {
        //                         'type': 'postback',
        //                         'title': 'No!',
        //                         'payload': 'no',
        //                     }
        //                 ],
        //             }]
        //         }
        //     }
        // };
    }

    // Send the response message
    callSendAPI(senderPsid, response);
}

// Handles messaging_postbacks events
async function handlePostback(senderPsid, receivedPostback) {
    let response;

    // Get the payload for the postback
    let payload = receivedPostback.payload;

    // Set the response based on the postback payload
    switch (payload) {
        // Search button
        case 'SEARCH_COURSES_BUTTON':
            response = { 'text': 'Nhập tên khóa học hoặc lĩnh vực để tìm kiếm khóa học' };
            break;
        // View list of category 
        case 'VIEW_COURSES_BY_CATEGORY_BUTTON':
            const listCategory = await categoryModel.all();
            if (listCategory.length > 0) {
                for (let i = 0; i < listCategory.length; i += CHUNK) {
                    const categoriesChunk = listCategory.slice(i, i + CHUNK);
                    response = createCategoryButtonsTemplate('Chọn lĩnh vực', categoriesChunk);
                    console.log("List of category: " + JSON.stringify(response));
                    callSendAPI(senderPsid, response);
                }
                return;
            }
            else response = { "text": "Không có khóa học nào, vui lòng thử lại!" };
            break;
        default:
            // View list course of topic
            if (payload.includes('TOPIC_ITEM_ID_')) {
                const topicId = payload.substring(14, payload.length);
                const topicItem = (await topicModel.getTopicById(topicId))[0];
                const listCourse = await courseModel.getCourseByTopic(topicId);
                if (listCourse.length > 0 && topicItem) {
                    for (let i = 0; i < listCourse.length; i += CHUNK) {
                        const listChunkCourse = listCourse.slice(i, i + CHUNK);
                        response = createCoursesButtonsTemplate(topicItem.title, listChunkCourse);
                        console.log("Response of get course of topic: " + JSON.stringify(response));
                        callSendAPI(senderPsid, response);
                    }
                    return;
                }
                else response = { "text": "Không có khóa học nào, vui lòng thử lại!" };
            } else
                // View detail of course
                if (payload.includes('COURSE_ITEM_ID_')) {
                    const course_id = payload.substring(15, payload.length);
                    const course = (await courseModel.getDetailCouresById(course_id))[0];
                    console.log("Course id: " + course_id);

                    const textRP = `${course.title}
                    Topic: ${course.topic_name}
                    Teacher: ${course.lecturer_first_name} ${course.lecturer_last_name}
                    Rating: ${course.rating}
                    Price: ${course.price}
                    Short description: ${course.short_description}
                    `;
                    console.log('textRP', textRP.length);

                    callSendAPI(senderPsid, textRP);

                    response = createViewCourseDetailsButtonsTemplate(course);

                }
                else
                    // View list of topic base on category
                    if (payload.includes('CATEGORY_ITEM_ID_')) {
                        const categoryId = payload.substring(17, payload.length);
                        console.log('categoryId', categoryId);
                        const categoryItem = (await categoryModel.getCategoryById(categoryId))[0];
                        console.log('categoryItem', categoryItem);
                        const listTopic = await topicModel.getTopicByCateId(categoryId);
                        console.log('listTopic', listTopic);
                        if (listTopic.length > 0 && categoryItem) {
                            for (let i = 0; i < listTopic.length; i += CHUNK) {
                                const listChunkTopic = listTopic.slice(i, i + CHUNK);
                                response = createTopicsButtonsTemplate(categoryItem.title, listChunkTopic);
                                console.log("Response of get topic of category: " + JSON.stringify(response));
                                callSendAPI(senderPsid, response);
                            }
                            return;
                        }
                        else response = { "text": "Không có khóa học nào, vui lòng thử lại!" };
                    }
    }
    // Send the message to acknowledge the postback
    callSendAPI(senderPsid, response);
}

// Sends response messages via the Send API
function callSendAPI(senderPsid, response) {
    // The page access token we have generated in your app settings
    const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
    // Construct the message body
    let requestBody = {
        'recipient': {
            'id': senderPsid
        },
        'message': response
    };
    // Send the HTTP request to the Messenger Platform
    request({
        'uri': 'https://graph.facebook.com/v2.6/me/messages',
        'qs': { 'access_token': FB_PAGE_ACCESS_TOKEN },
        'method': 'POST',
        'json': requestBody
    }, (err, _res, _body) => {
        if (!err) {
            console.log('Message sent!\n', response);
        } else {
            console.error('Unable to send message:' + err);
        }
    });
}


module.exports = {
    handleMessage: handleMessage,
    handlePostback: handlePostback,
};