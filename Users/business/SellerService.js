import SellerProfile from '../models/SellerProfile';
import User from '../models/User';
import BankAccount from '../models/BankAccount';
import Common from '../utils/Common';
import MessageHandler from '../handler/MessageHandler';
import UserService from './UserService';
import request from 'request-promise';
import {
    getMercadoPagoToken
}
from '../config/mercadopago';

class SellerService {

    async getSellerToken(sellerID) {
        const seller = await SellerProfile.findOne({
            $or: [{
                collectorID: sellerID
            }, {
                userID: sellerID
            }]
        });
        // console.log(seller);
        if (seller) {
            return seller.mercadoPagoToken;
        }

        throw MessageHandler.errorGenerator('Token does not found', 404)

    }

    async setSellerProfile(userData) {
        const user = await User.findById(userData.userID);

        if (!user) return MessageHandler.messageGenerator('The user does not exist', false);

        if (!user.sellerProfile) {

            userData._id = Common.generateID();
            userData.status = 'inactive';

            await SellerProfile.create(userData)

            const seller = {
                id: userData.userID,
                field: 'sellerProfile',
                value: userData._id
            };

            UserService.updateUser(seller, true);

            return MessageHandler.messageGenerator('Your seller profile was created successfully', true);
        }

        throw MessageHandler.errorGenerator("You already have an active seller profile", 400);

    }

    async updateSellerProfile(sellerData) {
        let sellerProfile = await SellerProfile.findOne({
            userID: sellerData.userID
        });

        if (!sellerProfile) return MessageHandler.messageGenerator('You do not have a seller profile', false);

        //TODO poder eliminar una cuenta bancaria y un perfil de mercadopago
        if (sellerProfile.status === 'inactive') sellerProfile.status = 'active';

        switch (sellerData.action) {
            case 'addBankAccount':
                {
                    sellerData.bankAccount._id = Common.generateID();
                    try {
                        const bankAccount = await BankAccount.create(sellerData.bankAccount);
                        sellerProfile.bankAccounts.push(bankAccount._id);
                        sellerProfile.save();
                    } catch (err) {
                        if (err.code === 11000 || err.code === 11001) {
                            return MessageHandler.messageGenerator("This account already has been created",
                                false);
                        }
                        throw err;
                    }

                    break;
                }
            case 'deleteBankAccount':
                {
                    const seller = await sellerProfile.findOne({userID: sellerData.userID})

                    if(!seller || seller.bankAccounts.length === 0) return MessageHandler.messageGenerator("Your seller profile is not ready yet to do this action", false);

                    if (seller.bankAccounts.length > 1) {
                        await BankAccount.remove({accountNumber: sellerData.accountNumber});
                        seller.bankAccounts = _.filter(seller.bankAccounts, account => account !== sellerData.accountNumber);
                        seller.save();
                        return MessageHandler.messageGenerator("Account deleted successfully", true);
                    }

                    throw MessageHandler.errorGenerator("You always must have at least one bank account", 400);

                }
            case 'setMercadoPago':
                {
                    if (!sellerProfile.collectorID) {

                        const requestData = getMpRequestModel(sellerData);

                        const mercadoPagoData = JSON.parse(await request(requestData));

                        sellerProfile.mercadoPagoToken = mercadoPagoData.access_token;
                        sellerProfile.mercadoPagoRefresh = mercadoPagoData.refresh_token;
                        sellerProfile.collectorID = mercadoPagoData.user_id;
                        sellerProfile.save();

                    } else {
                        return MessageHandler.messageGenerator('You already have a Mercado Pago config', false);
                    }
                    break;
                }
            case 'deleteMercadoPago':
                {
                    const seller = await sellerProfile.findOne({userID: sellerData.userID})

                    if(!seller || !sellerProfile.collectorID) return MessageHandler.messageGenerator("Your seller profile is not ready yet to do this action", false);

                    //CHECK IF THE SELLER DOESNT HAVE AN ACTIVE ORDER WITH MERCADOPAGO PAYMENT METHOD IN PROCESS

                    // sellerProfile.mercadoPagoToken = '';
                    // sellerProfile.mercadoPagoRefresh = '';
                    // sellerProfile.collectorID = '';
                    // sellerProfile.save();

                }
            default:
                break;

        }
        return MessageHandler.messageGenerator('Operation was done successfully', true);
    }

    async checkSellerPaymentMethods(paymentMethod, userID) {
        const seller = await SellerProfile.findOne({
            userID: userID
        });

        if (!seller) throw MessageHandler.errorGenerator('You do not have a seller profile yet', 200)

        switch (paymentMethod) {
            case 'automatic': // Payment through MercadoPago platform
                {
                    return !!seller.collectorID
                }
            case 'manual': // Payment through Email Contact
                {
                    return seller.bankAccounts.length > 0
                }
            case 'both': // Payment can be done by MercadoPago or Email contact
                {
                    return !!seller.collectorID && seller.bankAccounts.length > 0;
                }
            default:
                {
                    throw MessageHandler.errorGenerator('Invalid payment method', 400)
                }
        }
    }

}

const getMpRequestModel = ({mercardoPagoAuthCode}) => {
    // console.log(mercardoPagoAuthCode);
    const mpData = {
        'client_secret': getMercadoPagoToken(),
        'grant_type': 'authorization_code',
        'code': mercardoPagoAuthCode,
        'redirect_uri': 'http://localhost/'
    }

    const requestData = {
        method: 'POST',
        uri: 'https://api.mercadopago.com/oauth/token',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded'
        },

        body: JSON.stringify(mpData)
    }

    return requestData;
}

const sellerService = new SellerService();

export default sellerService;
