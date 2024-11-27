FROM node:lts-alpine
ENV TZ=Asia/Shanghai

WORKDIR /app
COPY package*.json ./

RUN npm install
COPY src/ ./src/

# 创建数据目录并设置权限
RUN mkdir -p /app/data && \
    chown -R node:node /app /app/data && \
    chmod -R 755 /app/src && \
    chmod -R 755 /app/data

# 切换到 node 用户
USER node

EXPOSE 3000

CMD ["node", "src/index.js"]