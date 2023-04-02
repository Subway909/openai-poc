# Installs Node.js image
FROM node:18.15.0-alpine3.17

# sets the working directory for any RUN, CMD, COPY command
# all files we put in the Docker container running the server will be in /usr/src/app (e.g. /usr/src/app/package.json)
WORKDIR /usr/src/app

# Copies package.json, package-lock.json, tsconfig.json, .env to the root of WORKDIR
COPY ["package.json", "package-lock.json", "tsconfig.json", ".env", "./"]

# Copies everything in the src directory to WORKDIR/src
COPY ./src ./src

# Configures npm to use /tmp as the cache directory
RUN npm config set cache /tmp --global

# Changes the owner of the /usr/local/bin directory to the current user
RUN chown -R $(whoami) /usr/local/bin

# Installs all packages
RUN npm install

# Runs the dev npm script to build & start the server
CMD npm run dev
