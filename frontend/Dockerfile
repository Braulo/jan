FROM node:14

WORKDIR /app

COPY . .

RUN npm i -g @angular/cli
RUN npm install

CMD ["ng", "serve", "--host", "0.0.0.0", "--disable-host-check"]

