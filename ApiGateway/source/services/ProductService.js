import moment from 'moment'

const setOffer = (product) => {

    if (product.offer) {

        let startDate = moment(new Date(product.offer.startDate));
        let endDate = moment(new Date(product.offer.endDate));
        let now = moment(new Date())


        if ((now.isAfter(startDate) && now.isBefore(endDate)) || (now.isSame(startDate)) || (now.isSame(endDate))) {

            product.offerPrice = product.offer.price;
            product.isOffer = true;

        } else {
            product.isOffer = false;
        }

        delete product.offer;

        return true;
    }

    product.isOffer = false;


}

export default {
    setOffer
}
