FROM node:latest

#Set enviroment variables

ENV appDir /var/www/app

# Create app directory
RUN mkdir -p $appDir
WORKDIR ${appDir}

# Install app dependencies
ADD package.json /var/www/app/
RUN npm install -g yarn
RUN yarn install

# Bundle app source
ADD . /var/www/app

EXPOSE 10122
CMD [ "npm", "start" ]
