import Studio from 'studio';
import Promise from 'bluebird';
import co from 'co';
import config from '../config/config';

import MessageHandler from '../handler/MessageHandler';

const UserComponent = Studio.module('UserComponent'); // Fetching User Microservice
const SellerComponent = Studio.module('SellerComponent'); // Fetching User/Seller Microservice

const {SC_EMAIL} = process.env;

class EmailService {

    async sendEmail(notificationData){

        let sg = config.getSendgridInstance();

        let {data,context} = notificationData;
        let retrieveUserField = UserComponent('retrieveUserField');
        let getBankAccounts = SellerComponent('getBankAccounts');
        let message = {};
        let subject = {};
        let userTargetData = await retrieveUserField({credential:data.subjectCredential,field:['email']});

        if(!userTargetData) return;

        switch (context) {

            case 'comment':
                subject = `New question in ${data.publicationName}`;
                message = `A client has made a new question in your publication ${data.publicationName} <br> The question is: <br><br> <blockquote> ${data.body} </blockquote>`;
            break;

            case 'response':
                subject = `New response in ${data.publicationName}`;
                message = `The Seller has commented in the publication ${data.publicationName} <br> The response is: <br><br> <blockquote> ${data.body} </blockquote>`;
            break;
            case 'newAutomaticOrder': {
                if( data.receiverTarget === 'Seller'){

                    let buyerData = await retrieveUserField({credential:data.buyerID,field:['email','username']});

                    subject = `Congrats! Someone has purchased you a product from your publication ${data.publicationName}`;
                    message = `<pre>The user <b>${buyerData.username} (${buyerData.email})</b> has purchased <b>${data.productQuantity}</b> products from your publication <b>${data.publicationName}</b> using the payment method <b>${data.paymentMethod}</b>, The amount you must get is ${data.totalPrice}.

                                We suggest that you contact him, so that the purchase is completed successfully.

                                Greetings.</pre>`;
                }else{

                }
            break;
            }
            case 'newManualOrder': {
                if( data.receiverTarget === 'Seller'){

                    let buyerData = await retrieveUserField({credential:data.buyerID,field:['email','username']});

                    subject = `Congrats! Someone has purchased you a product from your publication ${data.publicationName}`;
                    message = `<pre>The user <b>${buyerData.username} (${buyerData.email})</b> has purchased <b>${data.productQuantity}</b> products from your publication <b>${data.publicationName}</b> using the payment method <b>${data.paymentMethod}</b>, The amount you must get is ${data.totalPrice}.

                                We suggest that you contact him, so that the purchase can be completed successfully.

                                Greetings.</pre>`;
                }else{
                    let sellerData = await retrieveUserField({credential:data.sellerID,field:['email','username']});
                    let bankAccounts = await getBankAccounts(data.sellerID);

                    subject = `Congrats! You have purchased a product from the publication ${data.publicationName}`;
                    message = `<pre>The data of the order are as follows:

                                Name of the publication: ${data.publicationName}
                                Price of the product: ${data.unitPrice}
                                Quantity of products: ${data.productQuantity}
                                Total to pay: ${data.totalPrice}
                                Payment method: ${data.paymentMethod}

                                The seller's email is <b>${sellerData.email}</b>

                                Below is the information that the seller offered to receive payments</pre>`;

                                for (const bankAccount of bankAccounts) {
                                    message += `<pre>
                                                        BANK: ${bankAccount.bankName}
                                                        ACCOUNT NUMBER: ${bankAccount.accountNumber}
                                                        ACCOUNT'S OWNER: ${bankAccount.ownerAccountName}
                                                        TYPE OF ID: ${bankAccount.refOwnerIdentity}
                                                        ID: ${bankAccount.typeOwnerIdentity}
                                                        ACOUNT TYPE: ${bankAccount.accountType}
                                                </pre>`;
                                }


                }
            break;
            }
            case 'cancelOrder':{
                let buyerData = await retrieveUserField({credential:data.buyerID,field:['email','username']});

                subject = `An order of a purchased has been canceled`;
                message = `The Buyer ${buyerData.username} who purchased ${data.productQuantity} products of your publication ${data.publicationName} has canceled the order`;
            break;
            }
            case 'proccessOrder':{
                if( data.receiverTarget === 'Seller'){

                    let buyerData = await retrieveUserField({credential:data.buyerID,field:['email','username']});

                    subject = `Congrats! your order has been successfully proccesed`;
                    message = `The Order of your sell in which ${buyerData.username} bought ${data.productQuantity} products of your publication ${data.publicationName} for a price of ${data.totalPrice} has processed successfuly`;
                }else{
                    subject = `Congrats! your order has been successfully proccesed`;
                    message = `The Order generated for your purchase of ${data.productQuantity} products in the publication ${data.publicationName} for a price of ${data.totalPrice} has processed successfuly`;
                }
            break;
            }
            case 'finished':{
                let buyerData = await retrieveUserField({credential:data.buyerID,field:['email','username']});

                subject = `Congrats! your order has been successfully ranked by ${buyerData.username}`;
                message = `The Order of your sell in which ${buyerData.username} bought ${data.productQuantity} products of your publication ${data.publicationName} for a price of ${data.totalPrice} has finished successfuly`;
            break;
            }
            default:
            break;

        }

        let request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: _generateBodyObject(userTargetData, subject, message),
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

const _generateBodyObject = (userTargetData, subject, message) => ({
    personalizations: [
        {
            to: [
                {
                    email: userTargetData.email,
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
