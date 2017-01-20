import Studio from 'studio';
import co from 'co';
import _ from 'lodash';
import MessageHandler from '../handler/MessageHandler';
import Publication from '../models/Publication';
import Common from '../utils/Common';

class PublicationService {

    createNewPublication(publicationData) {
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
    }

    updatePublication(publicationData) {
        setData(publicationData, publicationData.publication);

        return publicationData.publication.save()
            .then((product) => {
                return MessageHandler.messageGenerator(
                    "The publication was updated successfully", true);
            }).catch((err) => {
                throw MessageHandler.errorGenerator(
                    "Something wrong happened updating publication",
                    500);
            });
    }

    removePublication(publicationData) {
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
    }

    getPublicationDetail(publicationData) {
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
                'status': 1
            })
            .select('-__v')
            .lean(true)
            .then((publication) => {

                if (!publication) throw MessageHandler.errorGenerator("Publication does not exist", 200); //reject the promise

                return publication;
            });
    }

    getPublicationBatch(publicationData) {
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
                'status': 1 //change to 1
            })
            .select('-__v')
            .lean(true)
            .then((publications) => {

                if (publications.length === 0) throw MessageHandler.errorGenerator(
                    "There aren't publications for what you are looking for", 200); //reject the promise

                return publications;
            });
    }

    checkPublicationStatus(productData) {
        return Publication.findOne({
                'productID': productData.productID
            })
            .select('-__v')
            .lean(true)
            .then((publication) => {
                if (publication) {

                    if (publication.status === 1) return false;

                    this.removePublication({
                        _id: publication._id
                    });
                }

                return true;
            });
    }

    async makeNewComment(commentData) {
        let publication = await Publication.findOne({
            '_id': commentData.publicationID
        });

        if (publication) {
            publication.comments = _.uniq(publication.comments.concat(commentData._id));
            await publication.save();
            return true;
        } else {
            throw MessageHandler.errorGenerator("The publication does not exist");
        }
    }

    async publicationBelongsToUser(publicationData, property) {
        return await Publication
            .findById(publicationData._id)
            .where({
                userID: publicationData.userID
            })
    }

}

/*HELPERS*/
const setData = (publicationData, publication) => {

    let {publicationDetail, name} = publicationData;

    publication.publicationDetail = !publicationDetail ? publication.publicationDetail : publicationDetail;
    publication.name = !name ? publication.name : name;
};

const publicationService = new PublicationService();

export default publicationService;
