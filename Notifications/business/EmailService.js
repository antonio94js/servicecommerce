import Studio from 'studio';
import Promise from 'bluebird';
import config from '../config/config';

import MessageHandler from '../handler/MessageHandler';

const sendEmail = (EmailData) => {

  let sg = config.sendgrid_instance();

  let request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [
        {
          to: [
            {
              email: EmailData.toEmail,
            },
          ],
          subject: EmailData.subject,
        },
      ],
      from: {
        email: EmailData.fromEmail,
      },
      content: [
        {
          type: 'text/html',
          value: EmailData.content,
        },
      ],
      template_id : "14fe1dfe-29a4-48b4-a92e-b336c1e07177",
    },
  });

  sg.API(request)
    .then(response => {
      console.log(response.statusCode);
      console.log(response.body);
      console.log(response.headers);
      // return MessageHandler.messageGenerator('Email sent successfully', true);
    })
    .catch(error => {
      //error is an instance of SendGridError
      //The full response is attached to error.response
      console.log(error);
      // throw MessageHandler.errorGenerator(error, 500);
    });
};

/*HELPERS*/

export default {
  sendEmail
};
