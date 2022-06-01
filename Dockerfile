FROM node:16.13.2-bullseye-slim as builder
RUN apt-get update || : && apt-get install -y \
    python3 \
    build-essential

RUN mkdir -p /tmp/app
RUN chmod -R 777 /tmp/app
WORKDIR /tmp/app
COPY package.json yarn.lock ./
RUN yarn install
COPY --chown=node . .
RUN yarn run build
USER node

FROM nginx:1.21.4-alpine
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
