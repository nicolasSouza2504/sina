FROM golang:1.24.6-alpine

ENV CGO_ENABLED=0 \
    GO111MODULE=on \
    GOPROXY=https://proxy.golang.org,direct \
    PATH="/go/bin:$PATH"          

RUN apk add --no-cache bash git

RUN go install github.com/air-verse/air@latest
RUN go install github.com/pressly/goose/v3/cmd/goose@latest


WORKDIR /app

COPY go.mod ./
RUN go mod download

COPY . .

RUN chmod +x ./docker/Entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["docker/Entrypoint.sh"]
