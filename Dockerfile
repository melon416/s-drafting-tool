# Description : Dockerfile of the drafting tool
# Author : multiple (Zulfat, Andrie Meyer ,Mohamed Maged ,Moataz Farid)
# ChangeLog : 25/5/2022 , Moataz , update node to 16.15.0-alpine and nginx to 1.21.6-alpine
FROM node:16.15.0-alpine as builder

RUN mkdir -p /tmp/app
RUN chmod -R 777 /tmp/app
WORKDIR /tmp/app
COPY package.json yarn.lock ./
RUN yarn install
COPY --chown=node . .
RUN yarn run build
USER node

FROM nginx:1.21.6-alpine
WORKDIR /var/www/app

RUN rm -f /etc/nginx/conf.d/*

COPY ./docker/nginx.conf /etc/nginx/conf.d/nginx.conf
COPY ./docker/run.sh /

RUN chmod +x /run.sh

COPY --from=builder /tmp/app/build/ /usr/share/nginx/html

#RUN find /usr/share/nginx/html

STOPSIGNAL SIGQUIT

EXPOSE 3002

ENTRYPOINT ["/run.sh"]
