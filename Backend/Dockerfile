FROM gcc:latest

# Install dependencies (update as needed)
RUN apt-get update && apt-get install -y \
    cmake \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy your backend code
COPY . .

# Build your C++ server (update the build command as needed)
RUN g++ -std=c++17 -o server main.cpp

# Expose the port your server listens on
EXPOSE 8080

# Run the server
CMD ["./server"]