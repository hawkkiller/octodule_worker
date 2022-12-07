FROM node:18-alpine3.15 AS builder

WORKDIR /app

COPY . .

RUN npm install pkg -g
RUN npm install

RUN npm run compile
RUN npm run start:build

FROM alpine AS runner
COPY --from=builder app/build/octodule /

CMD ["/octodule"]