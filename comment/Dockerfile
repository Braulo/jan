FROM node:lts-gallium

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN     npm install

ENV MYSQL_URI=

CMD ["npm", "start"]