FROM rust:1.57-buster as builder

RUN rustup target add x86_64-unknown-linux-musl

WORKDIR /app
COPY . .
RUN cargo build --target x86_64-unknown-linux-musl --release

FROM gcr.io/distroless/base-debian11

WORKDIR /app
COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/webserver-rust .
COPY --from=builder /app/Rocket.toml .

ENTRYPOINT ["./webserver-rust"]