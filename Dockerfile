FROM kaneda26/crossed-wires-base:1.0

WORKDIR /app
COPY package.json /app
RUN yarn
COPY . /app
CMD node src
EXPOSE 3000

