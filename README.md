# Service Commerce (Node API)

A API For a e-commerce platform developed using microservices architecture with the aim to study the principles, perks and drawbacks of this architecture.

This repository works like a *bundle* for all the microservices (including the API Gateway). Each directory inside this repository is a microservice that is independently deployed inside a docker and it connect to its own database.

This API was the main study case for my thesis degree. **(2016-2017)**

## API Gateway

The API Gateway is in charge of being the main router of system, finding and communicating with each microservice that has part of the client's final information, group them and return a simple response to the client with this information. In other words, It work like a proxy.

The API Gateway was made with Express and use RPC to communicate with the other microservices

## Microservices

All the microservices were developed with [StudioJS](https://github.com/ericholiveira/studio)

* Users - This microservice handle all the user logic including his wishlist and bankAccounts, that are included in the same bounded context
* Products - This microservice handle the product context (including the CRUD)
* Publications - This microservice handle the publication context (including the CRUD)
* Images - This microservice handle the images for every user and product
* Notification - This microservice handle the notification (push and email) for the customers and seller
* Orders - This microservice handle customers orders, including the payment process

### Technologies

Throughout all the microservices were used a bunch of third party service and tools with the aim to improve and automate some process, for example: payment, notifications, deployment, logging, etc.

* Docker - It helped to achieve the principle of "independent deployment", Isolating each microservice in its own virtual machine, also helped them to improve its resilience against other microservices failures.
* Papertrail - In a distributed system is quite common have issues with the information sended for all the components (in this cases all the microservices). Papertrail helped to me to centralizate all the logs in just one terminal.
* RabbitMQ - RabbitMQ was used to improve the resilience in all the system, giving the microservices a way to recovery the lost requests when they were down or failing.
* FCM - Used for sending push notifications (Notification microservice)
* Sendgrid - Used for sending email (Notification microservice)
* AWS S3 - Used for save images (Images microservice)
* MercadoPago API - Used for all the payment process (Order microservice)
