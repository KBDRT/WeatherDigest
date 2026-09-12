FROM node:20-alpine

ENV CITY="Москва"
ENV DAYS=3
ENV NOCACHE=true

WORKDIR /src

COPY package.json package-lock.json ./

RUN npm install

COPY . ./

CMD npm run withEnv