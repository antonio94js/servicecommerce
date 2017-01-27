import SellerProfile from '../models/SellerProfile';
import User from '../models/User';
import BankAccount from '../models/BankAccount';
import Common from '../utils/Common';
import MessageHandler from '../handler/MessageHandler';
import UserService from './UserService';
import request from 'request-promise';
import {getMercadoPagoToken} from '../config/mercadopago';

class SellerService {

    async getSellerToken(sellerID) {
        const seller = await SellerProfile.findOne({$or:[{collectorID:sellerID},{userID:sellerID}]});
        // console.log(seller);
        if (seller) {
            return seller.mercadoPagoToken;
        }

        throw MessageHandler.errorGenerator('Token does not found', 404)

    }

    async setSellerProfile(userData) {
        const user = await User.findById(userData.userID);
        if (user) {
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
            } else {
                throw MessageHandler.errorGenerator("You already have an active seller profile", 400);
            }

        } else {
            return MessageHandler.messageGenerator('The user does not exist', false);
        }
    }

    async updateSellerProfile(sellerData) {
        let sellerProfile = await SellerProfile.findOne({userID:sellerData.userID});
        if (sellerProfile) {
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
                case 'setMercadoPago':
                    {
                        if (!sellerProfile.collectorID) {

                            const mpData = {
                                'client_secret': getMercadoPagoToken(),
                                'grant_type': 'authorization_code',
                                'code': sellerData.mercardoPagoAuthCode,
                                'redirect_uri': 'http://localhost/'
                            }

                            const requestData = {
                                method: 'POST',
                                uri: 'https://api.mercadopago.com/oauth/token',
                                headers: {
                                    'accept': 'application/json',
                                    'content-type': 'application/x-www-form-urlencoded'
                                },

                                body:JSON.stringify(mpData)
                            }

                            const mercadoPagoData = JSON.parse(await request(requestData));

                            // console.log();

                            sellerProfile.mercadoPagoToken = mercadoPagoData.access_token;
                            sellerProfile.mercadoPagoRefresh = mercadoPagoData.refresh_token;
                            sellerProfile.collectorID = mercadoPagoData.user_id;
                            // console.log(sellerProfile);
                            sellerProfile.save();

                        } else {
                            return MessageHandler.messageGenerator('You already have a Mercado Pago config', false);
                        }
                        break;
                    }
                default:
                    break;

            }

            return MessageHandler.messageGenerator('Operation was done successfully', true);

        } else {
            return MessageHandler.messageGenerator('You do not have a seller profile', false);
        }
    }

    async checkSellerPaymentMethods(paymentMethod,userID) {
        const seller = await SellerProfile.findOne({userID:userID});
        console.log(userID);

        if (!seller) throw MessageHandler.errorGenerator('You do not have a seller profile yet',200)

        switch (paymentMethod) {
            case 'automatic': { // Payment through MercadoPago platform
                return !!seller.collectorID
            }
            case 'manual': { // Payment through Email Contact
                return seller.bankAccounts.length > 0
            }
            case 'both': {
                return !!seller.collectorID && seller.bankAccounts.length > 0;
            }
            default: {
                throw MessageHandler.errorGenerator('Invalid payment method',400)
            }

        }
    }

}

const sellerService = new SellerService();

export default sellerService;
