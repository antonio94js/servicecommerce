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
        let {data, context} = notificationData
        let retrieveUserField = UserComponent('retrieveUserField');
        // let message = {};

        let userData = yield retrieveUserField({credential: data.subjectCredential,field: 'fcmTokens'});

        if (!userData) return;

        switch (context) {

            case 'comment':

                _sendMessage(userData.fcmTokens,'New question in', data.publicationName)

                break;
            case 'response':

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


/*HELPERS*/

const _sendMessage = (tokensList,title,body) => {
    for (const token of tokensList) {
        fcm.send(_generateNotificationObject(token, title, body));
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


export default {
    sendPushNotification
};
