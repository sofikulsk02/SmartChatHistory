FROM gcc:latest

RUN apt-get update && apt-get install -y \
    cmake \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN g++ -std=c++17 -o server main.cpp

EXPOSE 8080

CMD ["./server"]