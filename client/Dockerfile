FROM node AS Production

ENV NODE_ENV=production

WORKDIR /usr/merck/src/client

COPY package.json .
COPY package-lock.json .

RUN npm install --force

COPY . .

RUN npm run build
RUN npm install -g serve

# CMD ["sh", "-c", "npm run start"]
CMD ["sh", "-c", "serve -s build"]