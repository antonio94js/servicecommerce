import Studio from 'studio';
import EmailService from '../business/EmailService';
import PublicationMiddelware from '../middleware/EmailMiddleware';

class EmailComponent {

    * sendEmail(EmailData) {

        return yield EmailService.sendEmail(EmailData);
    }

}

let email = Studio.serviceClass(EmailComponent);

if (process.env.NODE_ENV !== 'test') {

}
