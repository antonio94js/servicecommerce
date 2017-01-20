import Studio from 'studio';
import co from 'co';
import MessageHandler from '../handler/MessageHandler';
import Common from '../utils/Common';
import {fcm} from '../config/config';

const UserComponent = Studio.module('UserComponent'); // Fetching User Microservice

class PushNotificationService {

    async sendPushNotification(notificationData) {

        // co.wrap(function*() {
        const retrieveUserField = UserComponent('retrieveUserField');

        let {data, context} = notificationData
        let userData = await retrieveUserField({credential: data.subjectCredential,field: 'fcmTokens'});

        if (!userData) return;

        switch (context) {

            case 'comment': {
                    this.sendMessage(userData.fcmTokens, 'New question in', data.publicationName)
                    break;
                }
            case 'response': {
                    this.sendMessage(userData.fcmTokens, 'New response in', data.publicationName)
                    break;
                }

            default:
                break;
        }
    }

    sendMessage(tokensList, title, body) {
        for (const token of tokensList) {
            fcm.send(_generateNotificationObject(token, title, body));
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
