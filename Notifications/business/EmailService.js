import Studio from 'studio';
import Promise from 'bluebird';
import config from '../config/config';

import MessageHandler from '../handler/MessageHandler';

const UserComponent = Studio.module('UserComponent'); // Fetching User Microservice

const {SC_EMAIL} = process.env;

const sendEmail = (notificationData) => {

  co.wrap(function*() {

    let sg = config.getSendgridInstance();

    let {data,context} = notificationData;
    let retrieveUserField = UserComponent('retrieveUserField');
    let message = {};
    let subject = {};

    let userData = yield retrieveUserField({credential:data.ownerName,field:'email'});

    if(userData){
      switch (context) {

        case 'comment':
        
          subject = 'A new question has been made';
          message = "A client has made a new question in your publication '"+notificationData.publicationName+"\nThe question is: \n\n"+notificationData.body;

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

      let request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: {
          personalizations: [
            {
              to: [
                {
                  email: userData.email,
                },
              ],
              subject: subject,
            },
          ],
          from: {
            email: SC_EMAIL,
          },
          content: [
            {
              type: 'text/html',
              value: message,
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
    }

  })();
};

/*HELPERS*/

export default {
  sendEmail
};
