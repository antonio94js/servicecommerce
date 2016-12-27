import Studio from 'studio';
import co from 'co';
import _ from 'lodash';
import MessageHandler from '../handler/MessageHandler';
import Publication from '../models/Publication';

const createNewPublication = (publicationData) => {

    return Publication //return a promise
        .create(publicationData)
        .then((publication) => {

            return MessageHandler.messageGenerator("Publication created succefully", true); //resolve the promise
        })
        .catch((err) => {
            if (err.code === 11000 || err.code === 11001)
                throw MessageHandler.errorGenerator("The publication already exist", 409); //reject the promise
            // console.log("aqui" + err);
            throw MessageHandler.errorGenerator("Something wrong happened creating publication", 500); //reject the promise
        });

}

const removePublication = (publicationData) => {
    return Publication //return a promise
        .remove({
            _id: publicationData._id
        })
        .then((publication) => {
            return MessageHandler.messageGenerator("Publication deleted succefully", true); //resolve the promise
        })
        .catch((err) => {
            throw MessageHandler.errorGenerator("Something wrong happened deleted publication", 500); //reject the promise
        });
}

const getPublicationDetail = (publicationData) => {
    return Publication.findById(publicationData._id)
        .populate({
            'path': 'comments',
            'select': 'body date response',
            'populate': {
                'path': 'response',
                'select': 'body  date',
            }

        })
        .where({'status':0})
        .select('-__v')
        .lean(true)
        .then((product) => {
            return product;
        })
}

const makeNewComment = (commentData) => {
    console.log(commentData);
    return co.wrap(function*() {
        let publication = yield Publication.findOne({'_id': commentData.publicationID});

        if (publication) {

            publication.comments = _.uniq(publication.comments.concat(commentData._id));

            yield publication.save();

            return true;

        } else {
            throw MessageHandler.errorGenerator("The publication does not exist");
        }
    })();
}


/*HELPERS*/

const publicationBelongsToUser = (publicationData, property) => {
    // let lean = property === 'getProductDetail';
    return Publication.findById(publicationData._id)
        .where({
            userID: publicationData.userID
        })
        .then((product) => {
            return product;
        })
};



export default {
    createNewPublication, publicationBelongsToUser, removePublication, makeNewComment,getPublicationDetail
}
