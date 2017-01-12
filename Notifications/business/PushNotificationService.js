import Studio from 'studio';
import co from 'co';
import MessageHandler from '../handler/MessageHandler';
import Common from '../utils/Common';
import {
    fcm
}
from '../config/config';
const UserComponent = Studio.module('UserComponent'); // Fetching User Microservice

const sendPushNotification = (notificationData) => {

    co.wrap(function*() {
        // const TokenFCM = yield getTokenFCM(NotificationData.userID);
        let {data, context} = notificationData
        let retrieveUserField = UserComponent('retrieveUserField');
        let message = {};

        let userData = yield retrieveUserField({
            credential: data.subjectCredential,
            field: 'fcmTokens'
        });

        if (!userData) return;

        switch (context) {

            case 'comment':

                // for (const token of userData.fcmTokens) {
                //     message = _generateNotificationObject(token, 'New question in', data.publicationName);
                //     fcm.send(message)
                // }

                _sendMessage(userData.fcmTokens,'New question in', data.publicationName)

                // console.log(message);
                break;
            case 'response':

                // for (const token of userData.fcmTokens) {
                //     message = _generateNotificationObject(token, 'New response in', data.publicationName);
                //     fcm.send(message)
                // }
                _sendMessage(userData.fcmTokens,'New response in', data.publicationName)

                break;
                // case 'newOrder':
                //
                //     break;
                // case 'cancelOrder':
                //
                //     break;
                // case 'endOrder':
                //
                //     break;
            default:
                break;

        }


    })();
};

const _sendMessage = (tokensList,title,body) => {
    for (const token of tokensList) {
        message = _generateNotificationObject(token, title, body);
        fcm.send(message)
    }
}

const _generateNotificationObject = (token, title, body) => ({
    to: token, // required fill with device token or topics
    notification: {
        title: title,
        body: body,
        icon: "e-commerce-icon-icon.png"
    }
})



/*HELPERS*/


export default {
    sendPushNotification
};
