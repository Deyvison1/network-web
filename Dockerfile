# Etapa 1 - Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build -- --configuration production --no-prerender


# Etapa 2 - Servir Angular
FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist/network-web/browser ./dist

EXPOSE 80

CMD ["serve", "-s", "dist", "-l", "80"]