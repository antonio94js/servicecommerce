import Studio from 'studio';
import Promise from 'bluebird';
import co from 'co';
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

        let userData = yield retrieveUserField({credential:data.subjectcredential,field:'email'});

        if(!userData) return;

        switch (context) {

            case 'comment':
                subject = `New question in ${data.publicationName}`;
                message = `A client has made a new question in your publication ${data.publicationName} \n The question is: \n\n ${data.body}`;
            break;

            case 'response':
                subject = `New response in ${data.publicationName}`;
                message = `The Seller has commented in the publication ${data.publicationName} \n The response is: \n\n ${data.body}`;
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
            body: _generateBodyObject(userData, subject, message),
        });

        //SEND EMAIL THROUGH SENDGRID INSTANCE sg
        sg.API(request)
        .then(response => {
            console.log(response.statusCode);
            // return MessageHandler.messageGenerator('Email sent successfully', true);
        })
        .catch(error => {
            //error is an instance of SendGridError
            //The full response is attached to error.response
            console.log(error);
            // throw MessageHandler.errorGenerator(error, 500);
        });
    })();
};

/*HELPERS*/

const _generateBodyObject = (userData, subject, message) => ({
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
});

export default {
    sendEmail
};
