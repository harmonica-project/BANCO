from node:18-alpine
EXPOSE 3000
RUN mkdir /home/node/app
COPY ./src /home/node/app/src
COPY ./public /home/node/app/public
COPY ./package.json /home/node/app
WORKDIR /home/node/app
RUN npm install
CMD ["npm","start"]