FROM golang:1.24.6-alpine

ENV CGO_ENABLED=0 \
    GO111MODULE=on \
    GOPROXY=https://proxy.golang.org,direct

RUN apk add --no-cache bash git

RUN go install github.com/air-verse/air@latest

WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY . .

RUN chmod +x ./docker/Entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["docker/Entrypoint.sh"]
