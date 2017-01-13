import Studio from 'studio';
import NotificationService from '../business/PushNotificationService';
import EmailService from '../business/EmailService';


class NotificationComponent {

    * sendPushNotification(notificationData) {

        return yield NotificationService.sendPushNotification(notificationData);
    }

    * sendEmail(EmailData) {

        return yield EmailService.sendEmail(EmailData);
    }

}

Studio.serviceClass(NotificationComponent);
