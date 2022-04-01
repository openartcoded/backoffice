FROM node:16.14-alpine as builder
WORKDIR /usr/src/app
COPY package.json ./
RUN npm i --legacy-peer-deps
COPY . .
RUN npm run buildprod

FROM nginx:stable-alpine
COPY replace_placeholder.sh /
COPY --from=builder /usr/src/app/dist/artcoded-backoffice/browser /usr/share/nginx/html
EXPOSE 80

ENTRYPOINT [ "sh", "/replace_placeholder.sh" ]
CMD ["nginx",  "-g", "daemon off;"]

## Todo too many issue with angular universal. It has to be removed somehow
