FROM node:22-alpine AS builder
WORKDIR /usr/src/app
COPY package.json ./
#RUN npm i --legacy-peer-deps
RUN npm i 
COPY . .
RUN npm run buildprod

FROM nginx:stable-alpine
COPY replace_placeholder.sh /
COPY --from=builder /usr/src/app/dist/artcoded-backoffice/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types
EXPOSE 80

ENTRYPOINT [ "sh", "/replace_placeholder.sh" ]
CMD ["nginx",  "-g", "daemon off;"]

