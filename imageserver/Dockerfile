FROM node:lts-gallium

RUN mkdir -p /usr/src/app/storage
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN     npm install

VOLUME /usr/src/app/storage

ENV PORT=8081

EXPOSE ${PORT}

CMD ["npm", "start"]