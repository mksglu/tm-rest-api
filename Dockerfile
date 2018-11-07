FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# for typescript
RUN npm run build
COPY .env ./dist/
# templates
COPY src/routes/mail/templates/ ./dist/routes/mail/templates


EXPOSE 8080

CMD node dist/server.js