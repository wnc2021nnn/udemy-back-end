const request = require('request');
const facebookConfig = require('../config/facebook.config.json');

// Handles messages events
function handleMessage(senderPsid, receivedMessage) {
    let response;

    // Checks if the message contains text
    if (receivedMessage.text) {
        // Create the payload for a basic text message, which
        // will be added to the body of your request to the Send API
        response = createCoursesButtonsTemplate(`Ket qua: ${receivedMessage.text}`, []);
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
function handlePostback(senderPsid, receivedPostback) {
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
            response = createCategoriesButtonsTemplate('Chon linh vuc(category)', []);
            break;
        case 'WEB_CATEGORY_ID':
            response = createCoursesButtonsTemplate('Lập trình Web', []);
            break;
        case 'MOBILE_CATEGORY_ID':
            response = createCoursesButtonsTemplate('Lập trình thiết bị di động', [])
            break;
        default:
            if (payload.includes('COURSE_ID_')) {
                let text = `iOS & Swift - The Complete iOS App Development Bootcamp Master app marketing so you can publish your apps and generate downloads From Beginner to iOS App Developer with Just One Course! Fully Updated with a Comprehensive Module Dedicated to SwiftUI!
          What you'll learn
          Be able to build any app you want
          Start your own app based business
          Create a portfolio of apps to apply for junior developer jobs at a technology company
          Become a digital nomad by working as a freelance iOS developer
          Learn to work with Apple's latest UI Framework - SwiftUI
          Master creating Augmented Reality apps using Apple’s new ARKit
          Create apps that use Machine Learning using Apple’s new CoreML
          Be able to build any app you want
          Start your own app based business
          Create a portfolio of apps to apply for junior developer jobs at a technology company
          Become a digital nomad by working as a freelance iOS developer
          Learn to work with Apple's latest UI Framework - SwiftUI
          Master creating Augmented Reality apps using Apple’s new ARKit
          Create apps that use Machine Learning using Apple’s new CoreML
          Be able to build any app you want
          Start your own app based business
          Create a portfolio of apps to apply for junior developer jobs at a technology company
          Become a digital nomad by working as a freelance iOS developer
          Learn to work with Apple's latest UI Framework - SwiftUI
          Master creating Augmented Reality apps using Apple’s new ARKit
          Create apps that use Machine Learning using Apple’s new CoreML
          Master app design so you'll know how to wireframe, mockup and prototype your app idea`;

                let textRP = {
                    "text": text
                };

                callSendAPI(senderPsid, textRP);

                response = createViewCourseDetailsButtonsTemplate("iOS & Swift - The Complete iOS App Development Bootcamp", undefined);

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
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Khoa hoc thu 1",
                        "payload": "COURSE_ID_1"
                    },
                    {
                        "type": "postback",
                        "title": "Khoa hoc thu 2",
                        "payload": "COURSE_ID_2"
                    }
                ]
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
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Lập trình Web",
                        "payload": "WEB_CATEGORY_ID"
                    },
                    {
                        "type": "postback",
                        "title": "Lập trình thiết bị di động",
                        "payload": "MOBILE_CATEGORY_ID"
                    }
                ]
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
                    {
                        "type": "web_url",
                        "title": "Xem them compact",
                        "url": "https://wnc2021be.herokuapp.com/",
                        "webview_height_ratio": "compact"
                    },
                    {
                        "type": "web_url",
                        "title": "Xem them",
                        "url": "https://wnc2021be.herokuapp.com/",
                        "webview_height_ratio": "tall"
                    },
                    {
                        "type": "web_url",
                        "title": "Di den trang web",
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
};