import Studio from 'studio';
import EmailService from '../business/EmailComponent';
import PublicationMiddelware from '../middleware/EmailMiddleware';

class EmailComponent {

    * function1(EmailData) {

        return yield EmailService.function1(EmailData);
    }

}

let email = Studio.serviceClass(EmailComponent);

if (process.env.NODE_ENV !== 'test') {

}
