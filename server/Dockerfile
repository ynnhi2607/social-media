FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma Client before building
RUN npx prisma generate

RUN npm run build

EXPOSE 4000

CMD ["node", "dist/server.js"]

