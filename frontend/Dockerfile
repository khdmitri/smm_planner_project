#Stage 1 React app

FROM node:16.19 as build-stage

WORKDIR /app
# install app dependencies
#RUN yarn install --mode update-lockfile
COPY package.json yarn.lock ./
# add app
COPY . ./
RUN yarn
ENV PATH ./node_modules/.bin:$PATH
RUN yarn build
#EXPOSE 80


#Stage 2 nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/.next .

ENTRYPOINT ["nginx", "-g", "daemon off;"]
# start app
# CMD ["yarn", "start"]
