FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npx prisma db push
EXPOSE 8000
CMD [ "npm", "start" ]