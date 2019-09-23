FROM node:8-alpine

ENV PORT 80
EXPOSE 80

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

WORKDIR /app
COPY package*.json /app/

RUN npm install
COPY . /app

CMD ["npm", "start"]
