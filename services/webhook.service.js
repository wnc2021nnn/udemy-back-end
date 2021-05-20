const request = require('request');
const facebookConfig = require('../config/facebook.config.json');
// Model
const categoryModel = require("../models/category.model");
const courseModel = require("../models/course.model");
// Handles messages events
async function  handleMessage (senderPsid, receivedMessage) {
    let response;

    // Checks if the message contains text
    if (receivedMessage.text) {
        // Create the payload for a basic text message, which
        // will be added to the body of your request to the Send API
        const courseList = await courseModel.searchCourse(receivedMessage.text);        
        response = createCoursesButtonsTemplate(`Cac khoa hoc lien quan: ${receivedMessage.text}`, courseList);
        console.log("Response of search: "+JSON.stringify(response));
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
function  handlePostback (senderPsid, receivedPostback)  {
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
        case 'SEARCH_COURSES_BUTTON':
            response = { 'text': 'Nhập từ khóa để tìm kiếm' };
            break;
        case 'VIEW_COURSES_BY_CATEGORY_BUTTON':
            const categories = [];
            response = createCategoriesButtonsTemplate('Chọn lĩnh vực', categories);
            break;
        default:
            if (payload.includes('CATEGORY_ITEM_ID_')) {
                const courses = [];
                let categorie;
                response = createCoursesButtonsTemplate(categorie.name, courses);
            } else if (payload.includes('COURSE_ITEM_ID_')) {
                let course;
                courses_id = payload.substring(15, payload.length-1);
                courses = courseModel.getCourseByCateId(course_id);
                let textRP = {
                    "text": course.description
                };

                callSendAPI(senderPsid, textRP);

                response = createViewCourseDetailsButtonsTemplate(course.title, course);

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

function createCategoriesButtonsTemplate(title, categories) {
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": title,
                "buttons": categories.map(categorie => {
                    return {
                        "type": "postback",
                        "title": categorie.name,
                        "payload": `CATEGORY_ITEM_ID_${categorie.categorie_id}`
                    };
                })
            }
        }
    };
}

function createViewCourseDetailsButtonsTemplate(title, course) {
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": title,
                "buttons": [
                    // {
                    //     "type": "web_url",
                    //     "title": "Xem them compact",
                    //     "url": "https://wnc2021be.herokuapp.com/",
                    //     "webview_height_ratio": "compact"
                    // },
                    {
                        "type": "web_url",
                        "title": "Chi tiết",
                        "url": "https://wnc2021be.herokuapp.com/",
                        "webview_height_ratio": "tall"
                    },
                    {
                        "type": "web_url",
                        "title": "Xem trên trang web",
                        "url": "https://wnc2021be.herokuapp.com/",
                        "webview_height_ratio": "full"
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