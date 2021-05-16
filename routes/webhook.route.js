// https://developers.facebook.com/docs/messenger-platform/getting-started/webhook-setup

const { text } = require('body-parser');
const express = require('express');
const request = require('request');
const facebookConfig = require('../config/facebook.config.json');

const router = express.Router();

// Creates the endpoint for our webhook 
// This code creates a /webhook endpoint that accepts POST requests,
//  checks the request is a webhook event, then parses the message. 
//  This endpoint is where the Messenger Platform will send all webhook events.
// Note that the endpoint returns a 200OK response, 
//  which tells the Messenger Platform the event has been received and does not need to be resent. 
//  Normally, you will not send this response until you have completed processing the event.
router.post('/', (req, res) => {

  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {

      // Gets the body of the webhook event
      let webhookEvent = entry.messaging[0];
      console.log(webhookEvent);

      // Get the sender PSID
      let senderPsid = webhookEvent.sender.id;
      console.log('Sender PSID: ' + senderPsid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhookEvent.message) {
        handleMessage(senderPsid, webhookEvent.message);
      } else if (webhookEvent.postback) {
        handlePostback(senderPsid, webhookEvent.postback);
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Handles messages events
function handleMessage(senderPsid, receivedMessage) {
  let response;

  // Checks if the message contains text
  if (receivedMessage.text) {
    // Create the payload for a basic text message, which
    // will be added to the body of your request to the Send API
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": receivedMessage.text,
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
  } else if (receivedMessage.attachments) {

    // Get the URL of the message attachment
    let attachmentUrl = receivedMessage.attachments[0].payload.url;
    response = {
      'attachment': {
        'type': 'template',
        'payload': {
          'template_type': 'generic',
          'elements': [{
            'title': 'Is this the right picture?',
            'subtitle': 'Tap a button to answer.',
            'image_url': attachmentUrl,
            'buttons': [
              {
                'type': 'postback',
                'title': 'Yes!',
                'payload': 'yes',
              },
              {
                'type': 'postback',
                'title': 'No!',
                'payload': 'no',
              }
            ],
          }]
        }
      }
    };
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
    case 'yes':
      response = { 'text': 'Thanks!' };
      break;
    case 'no':
      response = { 'text': 'Oops, try sending another image.' };
      break;
    case 'SEARCH_COURSES_BUTTON':
      response = { 'text': 'Nhập từ khóa để tìm kiếm' };
      break;
    case 'VIEW_COURSES_BY_CATEGORY_BUTTON':
      response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "button",
            "text": 'Chon linh vuc(category)',
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
      }
      break;
    case 'WEB_CATEGORY_ID':
      response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "button",
            "text": 'Lập trình Web',
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
      }
      break;
    case 'MOBILE_CATEGORY_ID':
      response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "button",
            "text": 'Lập trình thiết bị di động',
            "buttons": [
              {
                "type": "postback",
                "title": "Khoa hoc thu 3",
                "payload": "COURSE_ID_3"
              },
              {
                "type": "postback",
                "title": "Khoa hoc thu 4",
                "payload": "COURSE_ID_4"
              }
            ]
          }
        }
      }
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

        // callSendAPI(senderPsid, textRP);

        response = {
          "text": text,
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "button",
              "text": "iOS & Swift - The Complete iOS App Development Bootcamp",
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

// Adds support for GET requests to our webhook
// This code adds support for the Messenger Platform's webhook verification to your webhook.
//  This is required to ensure your webhook is authentic and working.
// The verification process looks like this:
// -You create a verify token. This is a random string of your choosing, hardcoded into your webhook.
// -You provide your verify token to the Messenger Platform when you subscribe your webhook to receive webhook events for an app.
// -The Messenger Platform sends a GET request to your webhook with the token in the hub.verify parameter of the query string.
// -You verify the token sent matches your verify token, and respond with hub.challenge parameter from the request.
// -The Messenger Platform subscribes your webhook to the app.
router.get('/', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = facebookConfig.VERIFY_TOKEN

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

module.exports = router;



