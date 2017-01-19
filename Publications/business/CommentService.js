import Studio from 'studio';
import Promise from 'bluebird';
import co from 'co';

import MessageHandler from '../handler/MessageHandler';
import Comment from '../models/Comment';

const EmailComponent = Studio.module('EmailComponent');

const createNewComment = (commentData) => {

    const PublicationComponent = Studio.module('PublicationComponent');
    // const NotificationComponent = Studio.module('NotificationComponent');

    let makeComment = PublicationComponent('makeComment');

    let sendEmail = EmailComponent('sendEmail');

    return co.wrap(function*() {

        let comment = yield Comment.create(commentData);

        return makeComment(commentData)
            .then((value) => {

                _sendNotification(commentData, 'comment');

                return MessageHandler.messageGenerator("Your question was made", true);
            })
            .catch((err) => {
                removeComment(commentData);
                return MessageHandler.messageGenerator("The comment could not be created", false);
            })
    })();

}

const createNewResponse = (commentData) => {

    const PublicationComponent = Studio.module('PublicationComponent');
    // const NotificationComponent = Studio.module('NotificationComponent');

    let CheckOwnership = PublicationComponent('CheckOwnership');

    return co.wrap(function*() {
        let publicationData = {
            '_id': commentData.publicationID,
            'userID': commentData.userID //REVISAR INJECT
        };

        yield CheckOwnership(publicationData);

        let parentComment = yield Comment.findById(commentData.parentID);

        if (parentComment) {

            delete commentData.parentID;
            yield Comment.create(commentData);
            parentComment.response = commentData._id;
            yield parentComment.save();

            commentData.subjectCredential = parentComment.userID;

            _sendNotification(commentData, 'response');

            return MessageHandler.messageGenerator("The response was made", true);
        }

        return MessageHandler.messageGenerator("The question does not exist in this publication", false);


    })();

}

const removeComment = (commentData) => {
    // console.log("origna");
    return Comment.remove({
            '_id': commentData._id
        })
        .then((value) => {
            return MessageHandler.messageGenerator("The comment was deleted successfully", true);
        })
        .catch((err) => {
            throw err;
        })
}

const _sendNotification = (commentData, context) => {

    const NotificationComponent = Studio.module('NotificationComponent');

    let sendPushNotification = NotificationComponent('sendPushNotification');
    let sendEmail = NotificationComponent('sendEmail');
    let notificationData = {
        context: context,
        data: commentData
    }

    Promise.all([sendPushNotification(notificationData), sendEmail(notificationData)])
        .then((value) => {
            console.log(value);
        })
        .catch((err) => {
            console.log("HAY UN ERRO PUBLICANDO EN LA COLA");
            var amqp = require('amqplib/callback_api');

            amqp.connect('amqp://hjhorfiu:DaMb3cMfK86ah1IG0V5cfo5c5eRiyeWO@cat.rmq.cloudamqp.com/hjhorfiu', function(err, conn) {
                conn.createChannel(function(err, ch) {
                    var q = 'task_queue';
                    var msg = JSON.stringify(notificationData);

                    ch.assertQueue(q, {
                        durable: true
                    });
                    ch.sendToQueue(q, new Buffer(msg), {
                        persistent: true
                    });
                    console.log(" [x] Sent '%s'", msg);
                });
                setTimeout(function() {
                    conn.close();
                    // process.exit(0)
                }, 2000);
            });
        })
}



export default {
    createNewComment, createNewResponse, removeComment
}
