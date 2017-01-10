import Studio from 'studio';
import NotificationService from '../business/NotificationService';


class NotificationComponent {

    *function1(notificationData) {

        return yield NotificationService.function1(notificationData);
    }

}

Studio.serviceClass(NotificationComponent);
