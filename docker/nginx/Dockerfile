FROM node:12-alpine AS builder

WORKDIR /frontend

COPY ./frontend/package.json ./

RUN yarn install

COPY ./frontend/ ./
RUN yarn build


FROM staticfloat/nginx-certbot

COPY --from=builder /frontend/build/ /usr/share/nginx/html