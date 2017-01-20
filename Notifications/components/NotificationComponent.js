import Studio from 'studio';
import ErrorLoggerHanlder from '../handler/ErrorLoggerHandler';
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

const notificationComponent = Studio.serviceClass(NotificationComponent);

ErrorLoggerHanlder.setErrorLogger(notificationComponent);
