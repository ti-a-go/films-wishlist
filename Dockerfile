FROM node:22.13.1-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

FROM base AS development

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

FROM base AS test

CMD ["npm", "run", "test"]

FROM base AS build

RUN npm run build && npm prune --production

FROM build AS production

EXPOSE 3000

CMD ["node", "dist/main"]
