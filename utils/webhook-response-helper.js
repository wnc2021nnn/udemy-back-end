const createCoursesButtonsTemplate = (title, courses) => ({
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
})

const createCategoryButtonsTemplate = (title, listCategory) => ({
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "button",
            "text": title,
            "buttons": listCategory.map(categoryItem => {
                return {
                    "type": "postback",
                    "title": categoryItem.title,
                    "payload": `CATEGORY_ITEM_ID_${categoryItem.category_id}`
                };
            }),
        }
    }
});


const createTopicsButtonsTemplate = (title, topics) => ({
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
})

const createViewCourseDetailsButtonsTemplate = (course) => ({
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
})

module.exports = {
    createCoursesButtonsTemplate,
    createCategoryButtonsTemplate,
    createTopicsButtonsTemplate,
    createViewCourseDetailsButtonsTemplate
}