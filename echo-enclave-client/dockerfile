# Use Node.js LTS version
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Build the app
RUN npm run build

# Serve the app using a simple server
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start the app
CMD [ "serve", "-s", "build" ]
