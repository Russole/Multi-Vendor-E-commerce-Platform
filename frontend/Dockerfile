##### This is a two-stage build ######
##### Enter first stage #####
# need a complete node environment to compile our frontend program
# node environment for the first part and the alias 'builder'
FROM node:14-alpine as builder

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

##### nginx 的部分 #####
##### Enter Second stage #####
RUN npm run build

FROM nginx:1.19-alpine
# only need the compiled app and no other node dependencies anymore
# change the base image to using a much smaller 'alpine Linux'
# we need to copy files from the builder image
COPY --from=builder /app/build /usr/share/nginx/html

COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

# 無 nginx
# CMD [ "npm", "start"]
# 有 nginx
CMD [ "nginx", "-g", "daemon off;" ]