import Studio from 'studio';
import NotificationService from '../business/PushNotificationService';


class PushNotificationComponent {

    *sendPushNotification(notificationData) {

        return yield NotificationService.sendPushNotification(notificationData);
    }

}

Studio.serviceClass(PushNotificationComponent);
