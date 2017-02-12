import _ from 'lodash';
import Common from '../utils/Common'
import ProductService from './ProductService'

const joinPublicationData = (publications, products, users) => {
    try {
        for (const publication of publications) {

            publication.product = _.find(products, product => publication.productID === product._id)
            // console.log("product");
            ProductService.setOffer(publication.product);

            if(users) publication.seller = _.cloneDeep(_.find(users, user => publication.userID === user._id));
            // console.log("user");
            Common.removeNativeID(publication.product,publication.seller)

        }

    } catch (e) {
        // console.log(e);
    }



    return publications;
}




export default {
    joinPublicationData
}
