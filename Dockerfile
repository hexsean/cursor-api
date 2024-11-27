FROM node:lts-alpine
ENV TZ=Asia/Shanghai

WORKDIR /app
COPY package*.json ./

RUN npm install
COPY src/ ./src/
RUN mkdir -p /app/data && chown -R node:node /app/data

EXPOSE 3000

CMD ["node", "src/index.js"]