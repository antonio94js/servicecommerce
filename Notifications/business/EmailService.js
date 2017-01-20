import Studio from 'studio';
import Promise from 'bluebird';
import co from 'co';
import config from '../config/config';

import MessageHandler from '../handler/MessageHandler';

const UserComponent = Studio.module('UserComponent'); // Fetching User Microservice

const {SC_EMAIL} = process.env;

class EmailService {

    async sendEmail(notificationData){

        let sg = config.getSendgridInstance();

        let {data,context} = notificationData;
        let retrieveUserField = UserComponent('retrieveUserField');
        let message = {};
        let subject = {};
        let userData = await retrieveUserField({credential:data.subjectCredential,field:'email'});

        if(!userData) return;

        switch (context) {

            case 'comment':
                subject = `New question in ${data.publicationName}`;
                message = `A client has made a new question in your publication ${data.publicationName} <br> The question is: <br><br> <blockquote> ${data.body} </blockquote>`;
            break;

            case 'response':
                subject = `New response in ${data.publicationName}`;
                message = `The Seller has commented in the publication ${data.publicationName} <br> The response is: <br><br> <blockquote> ${data.body} </blockquote>`;
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
        // console.log(request);
        _sendMessage(request, sg);

    }
}

/*HELPERS*/

const _sendMessage = (request, sg) => {
    // console.log('sendmessage');
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
};

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

const emailService = new EmailService();

export default emailService;
