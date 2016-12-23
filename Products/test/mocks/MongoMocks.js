import {OfferMock} from './Fixtures';
import PromiseHandler from '../Promise';


const DuplicatedError = {
    "code": 11001
};

const findOne = (Offer) => {

    if(OfferMock._id === Offer._id) {

        return PromiseHandler.resolver(OfferMock)
    }
    else {

        return PromiseHandler.resolver(null)
    }
}

export default {findOne,DuplicatedError}
