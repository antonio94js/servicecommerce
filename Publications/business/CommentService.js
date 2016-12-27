import Studio from 'studio';
import Promise from 'bluebird';
import co from 'co';

import MessageHandler from '../handler/MessageHandler';
import Comment from '../models/Comment';



const PublicationComponent = Studio.module('PublicationComponent');

const createNewComment = (commentData) => {

    let makeComment = PublicationComponent('makeComment');

    return co.wrap(function*() {

        let comment = yield Comment.create(commentData)

        return makeComment(commentData)
            .then((value) => {
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
        let publicationData = {'_id': commentData.publicationID,'userID': commentData.userID};

        yield CheckOwnership(publicationData);

        let parentComment = yield Comment.findById(commentData.parentID).where();
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
