FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
RUN apk add --no-cache nginx
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY server/ /app/server/
RUN cd /app/server && npm install --omit=dev
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh
EXPOSE 80
CMD ["/app/start.sh"]
