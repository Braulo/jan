FROM node:lts-gallium

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN     npm install

ENV PORT=8080
ENV API_KEY=

EXPOSE ${PORT}

CMD ["npm", "start"]