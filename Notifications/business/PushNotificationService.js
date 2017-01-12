import Studio from 'studio';
import co from 'co';
import FCM from 'fcm-push';
import MessageHandler from '../handler/MessageHandler';
import Common from '../utils/Common';

// const UserComponent = Studio.module('UserComponent'); // Fetching User Microservice

const fcm = new FCM(
    'AAAAr9bYrYI:APA91bGB_2z8Kms_x1xnLR6NbgD4nhPCZxfrw6z1ypVE3wLyEa4OzdkWRGKwSw0yeg4MouOUFj49hCZGkoTpS2usI_MnrEEnymprTHtwfDixIociFz93v18zaRls20rE-1OXoqgea6Ip'
)

const sendPushNotification = (NotificationData) => {
    // let getTokenFCM = UserComponent('getTokenFCM');


    co.wrap(function*() {
        // const TokenFCM = yield getTokenFCM(NotificationData.userID);

        var message = {
            to: NotificationData.TokenFCM, // required fill with device token or topics
            notification: {
                title: 'Nueva operación',
                body: 'El token FCM fue configurado exitosamente',
                icon:"e-commerce-icon-icon.png"
            }
        };

        return yield fcm.send(message);

    })();
};

/*
previusToken
ActualToken

guardar token fcm en localStorage para permitir al usuario tener varias sesiones abiertas
y que le lleguen push

cuando se elimine el token en cliente tambien se debe hacer en el Server
cuando se actualize en cliente tambien hacerlo en Server
un cliente puede tener varios tokens asignados
*/
/*HELPERS*/


export default {
    sendPushNotification
};
