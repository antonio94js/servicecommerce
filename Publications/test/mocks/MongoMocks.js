import {
    PublicationMock
}
from './Fixtures';
import PromiseHandler from '../Promise';


const DuplicatedError = {
    "code": 11001
};

const findOne = (publication) => {

    if (publication._id === PublicationMock._id) {

        PublicationMock.save = () => PromiseHandler.resolver("Something");

        return PromiseHandler.resolver(PublicationMock)

    } else {

        return PromiseHandler.resolver(null)
    }
}

const findOneNested = (data) => {
    let productData = data;
    return {
        select: () => ({
            lean: () => {
                return (productData.productID === PublicationMock.productID) ?
                    PromiseHandler.resolver(PublicationMock) : PromiseHandler.resolver(null);
            }
        })
    }
}

const findById = (id) => {
    let publicationID = id;
    return {
        populate: () => ({
            where: () => ({
                select: () => ({
                    lean: () => {

                        return (publicationID === PublicationMock._id &&
                                PublicationMock.status === 1) ?
                            PromiseHandler.resolver(PublicationMock) : PromiseHandler.resolver(
                                null);
                    }
                })
            })
        })
    }
}


export default {
    findOne, DuplicatedError, findOneNested, findById
}
