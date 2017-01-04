import _ from 'lodash';

const joinPublicationData = (publications, products, users) => {

    for (const publication of publications) {

        publication.product = _.find(products, product => publication.productID === product._id)
        if(users) publication.users = _.find(users, user => publication.userID === user._id)

    }

    return publications;
}

export default {
    joinPublicationData
}
