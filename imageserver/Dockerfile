FROM node:lts-gallium

RUN mkdir -p /usr/src/app/storage
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN     npm install

VOLUME /usr/src/app/storage

ENV MYSQL_URI=

CMD ["npm", "start"]