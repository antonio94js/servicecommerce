import Studio from 'studio';
import co from 'co';
import _ from 'lodash';
import MessageHandler from '../handler/MessageHandler';
import Publication from '../models/Publication';
import Common from '../utils/Common';
import 'babel-polyfill';

class PublicationService {

    async createNewPublication(publicationData) {

        const isPaymentMethodAllowed = await checkPaymentMethod(publicationData);

        if (!isPaymentMethodAllowed) return MessageHandler.messageGenerator(
            `You have not activated - ${publicationData.paymentMethod} - selling method`, false,
            'PaymentMethodException')

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

    async removePublication(publicationData) {

        try {
            const publication = await Publication.findById(publicationData._id);

            if (publication.status === 0) {
                return this.remove(publication._id);
            }

            const hasActiveOrder = await this._checkOrderStatus(publicationData);
            // console.log(hasActiveOrder);

            if (!hasActiveOrder) {
                return this.remove(publication._id);
            }

            return MessageHandler.messageGenerator(
                "Publication can not be deleted, because is currently in an active order", false);

        } catch (e) {
            // console.log(e);
            return MessageHandler.messageGenerator("Publication can not be deleted at the momment, Try again later",
                false);
        }
    }

    remove(_id) {
        return Publication //return a promise
            .remove(_id)
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


    getExpandPublicationDetail(publicationData) {
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
            .where({
                'status': 1
            })
            .select('-__v -comments -tags -publicationDetail')
            .lean(true)
            .then((publications) => {

                if (publications.length === 0) throw MessageHandler.errorGenerator(
                    "There aren't publications for what you are looking for", 200);

                return publications;
            });
    }

    async getPublicationDetailByOwner(publicationData) {
        return await Publication.findById(publicationData._id).where({userID:publicationData.userID}).select('-__v').lean(true);
    }

    async getPublicationBatchByOwner(publicationData) {
        return await Publication.find({userID: publicationData.userID}).select('-__v -comments').lean(true);
    }

    async changePublicationStatus(publicationData) {
        const publication = await Publication.findById(publicationData._id);
        // console.log(publicationData);
        switch (parseInt(publicationData.newStatus)) {
            case 0: {
                if (publication.status === 1) {

                    //TODO make a checkorderstatus metho

                    const hasActiveOrder =  await this._checkOrderStatus(publicationData);

                    if (!hasActiveOrder) {
                        publication.status = 0;
                        await publication.save();
                        return MessageHandler.messageGenerator("Publication have been changed to inactive status successfully", true)
                    }

                    return MessageHandler.messageGenerator(
                        "Publication can't change to inactive status, because is currently in an active order", false);
                }

                return MessageHandler.messageGenerator("Publication already is in inactive status", false);
            }

            case 1: {
                if (publication.status === 0) {
                    publication.status = 1;
                    await publication.save();
                    return MessageHandler.messageGenerator("Publication have been changed to active status successfully", true)
                }
                return MessageHandler.messageGenerator("Publication already is in active status", false)
            }

            default: {
                throw MessageHandler.errorGenerator('Invalid publication status',400)
            }

        }
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

    async _checkOrderStatus({_id}) {
        const OrderComponent = Studio.module('OrderComponent');
        const checkOrderStatus = OrderComponent('checkOrderStatus');

        return await checkOrderStatus(_id);
    }

}

/*HELPERS*/
const setData = (publicationData, publication) => {

    let {publicationDetail, name, tags} = publicationData;

    publication.publicationDetail = !publicationDetail ? publication.publicationDetail : publicationDetail;
    publication.name = !name ? publication.name : name;
    publication.tags = !tags || !_.isArray(tags) ? publication.tags : tags;
};

const checkPaymentMethod = ({paymentMethod, userID}) => {
    const UserComponent = Studio.module('UserComponent');
    const checkSellerPaymentMethods = UserComponent('checkSellerPaymentMethods');
    return checkSellerPaymentMethods(paymentMethod, userID)
};

const publicationService = new PublicationService();

export default publicationService;
