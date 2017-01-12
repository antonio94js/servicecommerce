import Studio from 'studio';
import Promise from 'bluebird';
import co from 'co';

import MessageHandler from '../handler/MessageHandler';
import Comment from '../models/Comment';

const EmailComponent = Studio.module('EmailComponent');

const createNewComment = (commentData) => {

    let email = {
        "toEmail" : "alosalasv@gmail.com",
        "fromEmail" : "alosalasv@gmail.com",
        "subject": "New product created at your stock",
        "content": "A new brand product has been created by you in your stock, for more information, please get in touch with us"
    };

    const PublicationComponent = Studio.module('PublicationComponent');
    let makeComment = PublicationComponent('makeComment');

    let sendEmail = EmailComponent('sendEmail');

    return co.wrap(function*() {

        let comment = yield Comment.create(commentData);

        return makeComment(commentData)
            .then((value) => {
                sendEmail(email);
                return MessageHandler.messageGenerator("Your question was made", true);
            })
            .catch((err) => {
                removeComment(commentData);
                return MessageHandler.messageGenerator("The comment could not be created", false);
            })
    })();

}

const createNewResponse = (commentData) => {

    let CheckOwnership = PublicationComponent('CheckOwnership');

    return co.wrap(function*() {
        let publicationData = {
            '_id': commentData.publicationID,
            'userID': commentData.userID
        };

        yield CheckOwnership(publicationData);

        let parentComment = yield Comment.findById(commentData.parentID);

        if (parentComment) {
            delete commentData.parentID;
            yield Comment.create(commentData);
            parentComment.response = commentData._id;
            yield parentComment.save();

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



export default {
    createNewComment, createNewResponse, removeComment
}
