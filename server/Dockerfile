FROM node:15-alpine As development

WORKDIR /usr/src/app/server

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

RUN npm run build

####################

FROM development As test

ENV GIT_WORK_TREE=/usr/src/app/server GIT_DIR=/user/src/app/.git

RUN apk update && \
    apk add git

####################

FROM node:15-alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn --production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
