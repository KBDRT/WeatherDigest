FROM node:20-alphine
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
CMD npm start