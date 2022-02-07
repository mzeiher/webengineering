FROM golang:1.16 as builder

COPY . .
RUN ./build.sh

FROM gcr.io/distroless/base-debian11

COPY --from=builder /go/server /app/server
WORKDIR /app

CMD ["/app/server"]