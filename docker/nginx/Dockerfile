FROM node:12-alpine AS builder

WORKDIR /frontend

ADD ./frontend/package.json ./
ADD ./frontend/package-lock.json ./
#RUN yarn add json-2-csv
#RUN yarn add write-file-p
#RUN yarn install
RUN npm install json-2-csv
RUN npm install write-file-p
RUN npm install

ADD ./frontend/ ./

RUN npm run-script build

#FROM staticfloat/nginx-certbot
FROM nginx:stable-alpine as frontendserver
#ADD /frontend/build /usr/share/nginx/html
#ADD /frontend/build/ /bin/www
COPY --from=builder /frontend/build /usr/share/nginx/html
WORKDIR /nginx
ADD ./nginx/ ./
RUN rm /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf
#ADD /nginx/nginx-server.conf /etc/nginx/conf.d/default.conf
#ADD /nginx/nginx-server.conf /etc/nginx/nginx.conf
#ADD /nginx/nginx.conf /etc/nginx/nginx.conf
ADD /nginx/nginx.conf /etc/nginx/conf.d/default.conf
ADD /nginx/nginx.conf /etc/nginx/sites-enabled/default
ADD /nginx/nginx.conf /etc/nginx/sites-available
EXPOSE 80
EXPOSE 443
CMD [ "nginx", "-g", "daemon off;" ]