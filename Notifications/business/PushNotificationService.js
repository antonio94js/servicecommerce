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
        let {data,context} = notificationData
        let retrieveUserField = UserComponent('retrieveUserField');
        let message = {};
        switch (context) {

            case 'comment':
                let {fcmTokens} = yield retrieveUserField({credential:data.ownerName,field:'fcmTokens'});

                for (const token of fcmTokens) {
                    message = _generateNotificationObject(token,'A new comment was made in',data.publicationName);
                    fcm.send(message)
                }

                // console.log(message);
                break;
            case 'response':

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

        // fcm.send(message).then((value) => {
        //     console.log(value);
        // }).catch((err) => {
        //     console.log(err);
        // })


        // return yield fcm.send(message);

    })();
};

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
