FROM node:latest

#Set enviroment variables
ENV appDir /var/www/app

# Create app directory
RUN mkdir -p $appDir
WORKDIR ${appDir}

# Install app dependencies
ADD package.json /var/www/app/
RUN npm i -g pm2
RUN npm i -g yarn
RUN yarn


# Bundle app source
ADD . /var/www/app

# Compilate the app
RUN npm run build

# Exposing app port
EXPOSE 10124

# Staring App
ENTRYPOINT ["pm2", "start"]
CMD ["dist/app.js","--name=order","--no-daemon"]
