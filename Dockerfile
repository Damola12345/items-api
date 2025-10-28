FROM node:20-alpine 

# Set working directory
WORKDIR /usr/src/app

# Copy source & dependency files
COPY package.json package-lock.json* ./
COPY src ./src
COPY . .

# Install dependencies (omit dev)
RUN npm install --omit=dev

EXPOSE 8080

# Start app
CMD ["npm", "start"]