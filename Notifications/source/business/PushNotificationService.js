import Studio from 'studio';
import co from 'co';
import MessageHandler from '../handler/MessageHandler';
import Common from '../utils/Common';
import {fcm} from '../config/config';
import 'babel-polyfill';

const UserComponent = Studio.module('UserComponent'); // Fetching User Microservice

class PushNotificationService {

    async sendPushNotification(notificationData) {

        // co.wrap(function*() {
        const retrieveUserField = UserComponent('retrieveUserField');

        let {data, context} = notificationData
        // console.log({credential: data.subjectCredential,field: ['fcmTokens']});
        const userData = await retrieveUserField({credential: data.subjectCredential,field: ['fcmTokens']});
// console.log(userData);
        if (!userData) return;

        switch (context) {

            case 'comment':
                {
                    this.sendMessage(userData.fcmTokens, 'New question in', data.publicationName)
                    break;
                }
            case 'response':
                {
                    this.sendMessage(userData.fcmTokens, 'New response in', data.publicationName)
                    break;
                }
            case 'newAutomaticOrder':
                {
                    let buyerData = await retrieveUserField({credential:data.buyerID,field:['email','username']});

                    this.sendMessage(userData.fcmTokens, `New purchase by ${buyerData.username} in`, data.publicationName);
                    break;
                }
            case 'newManualOrder':
                {
                    if( data.receiverTarget === 'Seller'){
                        let buyerData = await retrieveUserField({credential:data.buyerID,field:['email','username']});

                        this.sendMessage(userData.fcmTokens, `New purchase by ${buyerData.username} in`, data.publicationName);
                    }
                    break;
                }
            case 'cancelOrder':
                {
                    let buyerData = await retrieveUserField({credential:data.buyerID,field:['email','username']});

                    this.sendMessage(userData.fcmTokens, `The user ${buyerData.username} has cancelled a purchase order in`, data.publicationName)
                    break;
                }
            case 'proccessOrder':
                {
                    if( data.receiverTarget === 'Seller'){
                        let buyerData = await retrieveUserField({credential:data.buyerID,field:['email','username']});

                        this.sendMessage(userData.fcmTokens, `${buyerData.username} has paid a purchase order in`, data.publicationName)
                    }else{
                        let sellerData = await retrieveUserField({credential:data.sellerID,field:['email','username']});

                        this.sendMessage(userData.fcmTokens, `${sellerData.username} has approved your payment in`, data.publicationName)
                    }
                    break;
                }
            case 'finished':
                {
                    this.sendMessage(userData.fcmTokens, 'Your purchase order is finished', data.publicationName)
                    break;
                }
            default:
                break;
        }
    }

    sendMessage(tokensList, title, body) {
        for (const token of tokensList) {
            if (token) {
                fcm.send(_generateNotificationObject(token, title, body)).then(() => {}).catch((err) => {})
            }

        }
    }
}

/*HELPERS*/

const _generateNotificationObject = (token, title, body) => ({
    to: token, // required fill with device token or topics
    notification: {
        title: title,
        body: body,
        icon: "e-commerce-icon-icon.png"
    }
})

const pushNotificationService = new PushNotificationService();

export default pushNotificationService
