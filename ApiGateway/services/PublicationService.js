import _ from 'lodash';
import Common from '../utils/Common'
import ProductService from './ProductService'

const joinPublicationData = (publications, products, users) => {

    for (const publication of publications) {

        publication.product = _.find(products, product => publication.productID === product._id)

        ProductService.setOffer(publication.product);

        if(users) publication.user = _.cloneDeep(_.find(users, user => publication.userID === user._id));

        Common.removeNativeID(publication.product,publication.user)

    }

    return publications;
}




export default {
    joinPublicationData
}
