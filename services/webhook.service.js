const request = require('request');
const facebookConfig = require('../config/facebook.config.json');
// Model
const categoryModel = require("../models/category.model");
const courseModel = require("../models/course.model");
const topicModel = require('../models/topic.model');
const topicMode = require("../models/topic.model")
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
            const chunk = 3;
            for (let i = 0; i < courseList.length; i += chunk) {
                const chunkCourseList = courseList.slice(i, i + chunk);
                response = createCoursesButtonsTemplate(`Cac khoa hoc lien quan: ${receivedMessage.text}`, chunkCourseList);
                callSendAPI(senderPsid, response);
                console.log("Response of search: " + JSON.stringify(response));
            }
            return;
        }
        else response = { "text": "Not found any result, please try another keyword!" }
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
        // case 'yes':
        //     response = { 'text': 'Thanks!' };
        //     break;
        // case 'no':
        //     response = { 'text': 'Oops, try sending another image.' };
        //     break;
        // Search button
        case 'SEARCH_COURSES_BUTTON':
            response = { 'text': 'Nhập từ khóa để tìm kiếm' };
            break;
        // View list of category 
        case 'VIEW_COURSES_BY_CATEGORY_BUTTON':
            const listTopic = topicMode.getAll();
            if (listTopic.length > 0) {
                const chunk = 3;
                for (let i = 0; i < listTopic.length; i += chunk) {
                    const topicsChunk = listTopic.slice(i, i + chunk);
                    response = createTopicsButtonsTemplate('Chọn chủ đề', topicsChunk);
                    console.log("List of topic: " + JSON.stringify(response));
                    callSendAPI(senderPsid, response);
                }
                return;
            }
            else response = { "text": "Not found any result, please try again!" };
            break;
        default:
            // View list course of category
            if (payload.includes('TOPIC_ITEM_ID_')) {
                const topicId = payload.substring(14, payload.length);
                const topicItem = await topicModel.getTopicById(topicId);
                const listTopic = await categoryModel.getCategoryByTopicId(topicId);
                if (listTopic.length > 0 && topicItem) {
                    const chunk = 3;
                    for (let i = 0; i < listTopic.length; i += chunk) {
                        const listChunkTopic = listTopic.slice(i, i + chunk);
                        response = createCategoryButtonsTemplate(topicItem.title, listChunkTopic);
                        console.log("Response of get category of topic: " + JSON.stringify(response));
                        callSendAPI(senderPsid, response);
                    }
                    return;
                }
                else response = { "text": "Not found any result, please try again!" };
            } else
                // View detail of course
                if (payload.includes('COURSE_ITEM_ID_')) {
                    const course_id = payload.substring(15, payload.length);
                    const course = await courseModel.getDetailCouresById(course_id);
                    console.log("Course id: " + course_id);

                    //callSendAPI(senderPsid, textRP);

                    response = createViewCourseDetailsButtonsTemplate(course);

                }
    }
    // Send the message to acknowledge the postback
    callSendAPI(senderPsid, response);
}

// Sends response messages via the Send API
function callSendAPI(senderPsid, response) {

    // The page access token we have generated in your app settings
    const PAGE_ACCESS_TOKEN = facebookConfig.PAGE_ACCESS_TOKEN;

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
        'qs': { 'access_token': PAGE_ACCESS_TOKEN },
        'method': 'POST',
        'json': requestBody
    }, (err, _res, _body) => {
        if (!err) {
            console.log('Message sent!');
        } else {
            console.error('Unable to send message:' + err);
        }
    });
}

function createCoursesButtonsTemplate(title, courses) {
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": title,
                "buttons": courses.map(course => {
                    return {
                        "type": "postback",
                        "title": course.title,
                        "payload": `COURSE_ITEM_ID_${course.course_id}`
                    };
                })
            }
        }
    };
}

const createCategoryButtonsTemplate = (title, listCategory) => {
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": title,
                "buttons": listCategory.map(categoryItem => {
                    return {
                        "type": "postback",
                        "title": categoryItem.name,
                        "payload": `CATEGORY_ITEM_ID_${categoryItem.category_id}`
                    };
                }),
            }
        }
    };
}

function createTopicsButtonsTemplate(title, topics) {
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": title,
                "buttons": topics.map(topic => {
                    return {
                        "type": "postback",
                        "title": topic.title,
                        "payload": `TOPIC_ITEM_ID_${topic.topic_id}`
                    };
                }),
            }
        }
    };
}

function createViewCourseDetailsButtonsTemplate(course) {
    console.log("Course: " + JSON.stringify(course));
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": course.title,
                        "image_url": "https://i.picsum.photos/id/941/200/300.jpg?hmac=tSztWslp5Hm2jEg1UjAvvVNsaDT3dsPAEZ5lQ_yhNKA",
                        "subtitle": course.description,
                        "default_action": {
                            "type": "web_url",
                            "url": "https://wnc2021be.herokuapp.com/",
                            "webview_height_ratio": "FULL"
                        },
                    },
                ]
            }
        }
    };
}
module.exports = {
    handleMessage: handleMessage,
    handlePostback: handlePostback,
    createCoursesButtonsTemplate,
};