FROM node:lts-gallium

WORKDIR /app

COPY . . 

RUN npm install

RUN npm i -g @angular/cli

CMD ["ng", "serve", "--host", "0.0.0.0"]

