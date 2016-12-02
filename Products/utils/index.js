const checkFalsy = (productData, product) => {
    let { productdetail, status, price, quantity, name } = productData;
    product.productdetail = !productdetail ? product.productdetail : productdetail;
    product.status = !status ? product.status : status;
    product.price = !price ? product.price : price;
    product.quantity = !quantity ? product.quantity : quantity;
    product.name = !name ? product.name : name;
};
const getRandomPort = () => Math.floor(Math.random() * (10200 - 8081 + 1) +
    8081);
export default {
    getRandomPort
};
