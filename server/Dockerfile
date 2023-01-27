FROM node:14 AS Production

ENV NODE_ENV=production

WORKDIR /usr/merck/src/server

COPY package.json .
COPY package-lock.json .

RUN npm install -g typescript
RUN npm install --force

COPY . .

CMD ["sh", "-c", "npx prisma migrate dev --name docker && tsc && node build/index.js"]