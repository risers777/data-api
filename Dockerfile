FROM node:14-apline 

WORKDIR /app

COPY . . 

RUN npm install --production

EXPOSE 8080