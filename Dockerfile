FROM asia-south1-docker.pkg.dev/apollo247-common-logistics/ap247-image-registry/node-base:16.14.0-alpine AS build
LABEL maintainer="Apollo24|7"

RUN mkdir -p /apollo-dialogflow-webhooks/logs /apollo-dialogflow-webhooks/assets \
  && chown -R node:node /apollo-dialogflow-webhooks

WORKDIR /apollo-dialogflow-webhooks

COPY --chown=node:node package*.json ./

USER node
ENV NPM_CONFIG_CACHE=/tmp/.npm-cache

RUN npm cache clean -force --loglevel=error && npm install

COPY --chown=node:node ./ /apollo-dialogflow-webhooks

RUN npm run build

FROM asia-south1-docker.pkg.dev/apollo247-common-logistics/ap247-image-registry/node-base:16.14.0-alpine
LABEL maintainer="Apollo24|7"

RUN mkdir -p /apollo-dialogflow-webhooks/logs \
  && chown -R node:node /apollo-dialogflow-webhooks

WORKDIR /apollo-dialogflow-webhooks

COPY --chown=node:node --from=build /apollo-dialogflow-webhooks/package.json  /apollo-dialogflow-webhooks/package.json 
COPY --chown=node:node --from=build /apollo-dialogflow-webhooks/dist /apollo-dialogflow-webhooks/dist
COPY --chown=node:node --from=build /apollo-dialogflow-webhooks/node_modules /apollo-dialogflow-webhooks/node_modules

WORKDIR /apollo-dialogflow-webhooks

USER node

CMD ["npm", "start"]