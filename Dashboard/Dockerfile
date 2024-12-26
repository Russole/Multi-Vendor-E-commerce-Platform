FROM node:14-alpine as builder

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# nginx 的部分

RUN npm run build

FROM nginx:1.19-alpine

COPY --from=builder /app/build /usr/share/nginx/html

COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3001

# 無 nginx
# CMD [ "npm", "start"]
# 有 nginx
CMD [ "nginx", "-g", "daemon off;" ]