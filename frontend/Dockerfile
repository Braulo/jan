FROM node:14

WORKDIR /app

COPY package.json .

RUN npm install

VOLUME [ "/node_modules" ]

COPY . . 

RUN npm i -g @angular/cli

CMD ["ng", "serve", "--host", "0.0.0.0"]