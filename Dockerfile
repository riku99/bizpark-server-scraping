FROM node:14
RUN apt-get update && apt-get install
WORKDIR /app
COPY package*.json /app/
RUN yarn install
COPY . /app/
CMD ["yarn", "start"]