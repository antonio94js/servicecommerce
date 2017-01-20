import Studio from 'studio';
import Promise from 'bluebird';
import co from 'co';

import MessageHandler from '../handler/MessageHandler';
import Comment from '../models/Comment';

const EmailComponent = Studio.module('EmailComponent');

class CommentService {

    async createNewComment(commentData) {

        const PublicationComponent = Studio.module('PublicationComponent');
        // const NotificationComponent = Studio.module('NotificationComponent');

        const makeComment = PublicationComponent('makeComment');

        // let sendEmail = EmailComponent('sendEmail');

        // return co.wrap(function*() {

            let comment = await Comment.create(commentData);

            return makeComment(commentData)
                .then((value) => {

                    _sendNotification(commentData, 'comment');

                    return MessageHandler.messageGenerator("Your question was made", true);
                })
                .catch((err) => {
                    this.removeComment(commentData);
                    return MessageHandler.messageGenerator("The comment could not be created", false);
                })
        // })();

    }

    async createNewResponse(commentData) {

        const PublicationComponent = Studio.module('PublicationComponent');
        // const NotificationComponent = Studio.module('NotificationComponent');

        const CheckOwnership = PublicationComponent('CheckOwnership');

        // return co.wrap(function*() {
            let publicationData = {
                '_id': commentData.publicationID,
                'userID': commentData.userID //REVISAR INJECT
            };

            await CheckOwnership(publicationData);

            let parentComment = await Comment.findById(commentData.parentID);

            if (parentComment) {

                delete commentData.parentID;
                await Comment.create(commentData);
                parentComment.response = commentData._id;
                await parentComment.save();

                commentData.subjectCredential = parentComment.userID;

                _sendNotification(commentData, 'response');

                return MessageHandler.messageGenerator("The response was made", true);
            }

            return MessageHandler.messageGenerator("The question does not exist in this publication", false);


        // })();

    }

    removeComment(commentData) {
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
}

const _sendNotification = (commentData, context) => {

    const NotificationComponent = Studio.module('NotificationComponent');

    const sendPushNotification = NotificationComponent('sendPushNotification');
    const sendEmail = NotificationComponent('sendEmail');
    let notificationData = {
        context: context,
        data: commentData
    }

    Promise.all([sendPushNotification(notificationData), sendEmail(notificationData)])
        .then((value) => {
            // console.log(value);
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

//METODO QUE DEVUELVA PROMESSA CON LA CONEXION, CONECTAR Y DESCONECTARSE AL USAR PUSHMESSAGE


const commentService =  new CommentService();

export default commentService
