import Studio from 'studio';
import co from 'co';
import _ from 'lodash';
import MessageHandler from '../handler/MessageHandler';
import Publication from '../models/Publication';
import Common from '../utils/Common';

const createNewPublication = (publicationData) => {

    return Publication //return a promise
        .create(publicationData)
        .then((publication) => {

            return MessageHandler.messageGenerator(
                "Publication created succefully", true); //resolve the promise
        })
        .catch((err) => {

            if (err.code === 11000 || err.code === 11001)
                throw MessageHandler.errorGenerator(
                    "The publication already exist", 409); //reject the promise
            // console.log("aqui" + err);
            throw MessageHandler.errorGenerator(
                "Something wrong happened creating publication",
                500); //reject the promise
        });

};

const updatePublication = (publicationData) => {

    setData(publicationData, publicationData.publication);

    return publicationData.publication.save()
        .then((product) => {
            return MessageHandler.messageGenerator(
                "The publication was updated successfully", true);
        }).catch((err) => {
            return MessageHandler.errorGenerator(
                "Something wrong happened updating publication",
                500);
        });
};

const removePublication = (publicationData) => {
    return Publication //return a promise
        .remove({
            _id: publicationData._id
        })
        .then((publication) => {
            return MessageHandler.messageGenerator(
                "Publication deleted succefully", true); //resolve the promise
        })
        .catch((err) => {
            throw MessageHandler.errorGenerator(
                "Something wrong happened deleted publication", 500
            ); //reject the promise
        });
};

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
        .where({
            'status': 0 //change to 1
        })
        .select('-__v')
        .lean(true)
        .then((publication) => {

            if (!publication) throw MessageHandler.errorGenerator("Publication does not exist", 200); //reject the promise

            return publication;
        });
}


const getPublicationBatch = (publicationData) => {

    return Publication.find({
            $text: {
                $search: Common.sanitizeQuery(publicationData.queryText)
            }
        })
        .populate({
            'path': 'comments',
            'select': 'body date response',
            'populate': {
                'path': 'response',
                'select': 'body  date',
            }

        })
        .where({
            'status': 0 //change to 1
        })
        .select('-__v')
        .lean(true)
        .then((publications) => {

            if (publications.length === 0) throw MessageHandler.errorGenerator("There aren't publications for what you are looking for", 200); //reject the promise

            return publications;
        });
}



const checkPublicationStatus = (productData) => {
    return Publication.findOne({
            'productID': productData._id
        })
        // .where({'status':0}) //change to 1
        .select('-__v')
        .lean(true)
        .then((publication) => {
            if (publication && publication.status === 1) {
                return false;
            } else {
                return true;
            }
        });
};

const makeNewComment = (commentData) => {

    return co.wrap(function*() {
        let publication = yield Publication.findOne({
            '_id': commentData.publicationID
        });

        if (publication) {

            publication.comments = _.uniq(publication.comments.concat(commentData._id));

            yield publication.save();

            return true;

        } else {
            throw MessageHandler.errorGenerator("The publication does not exist");
        }
    })();
};


/*HELPERS*/

const publicationBelongsToUser = (publicationData, property) => {

    return Publication.findById(publicationData._id)
        .where({
            userID: publicationData.userID
        })
        .then((product) => {
            return product;
        });
};

const setData = (publicationData, publication) => {
    let {
        publicationDetail, name
    } = publicationData;
    publication.publicationDetail = !publicationDetail ? publication.publicationDetail : publicationDetail;
    publication.name = !name ? publication.name : name;
};


export default {
    createNewPublication, publicationBelongsToUser, removePublication,
    checkPublicationStatus, makeNewComment, getPublicationDetail,
    updatePublication, getPublicationBatch
};
