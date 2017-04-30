# Crossed Wires

### Requirements

- Node 7.6.0 (for Async/Await support)


### Optional Development Dependencies

Crossed Wires supports the following global node applications:

- [Nodemon](https://github.com/remy/nodemon) - for automatic service restart on source updates
- [Yarn](https://yarnpkg.com/en/) - NPM drop-in replacement offering superior speed and dependency resolution


### Getting started

Note that the following instructions assume you have Yarn installed. You can substitue the following NPM commands if
you don't use Yarn.

* Install dependencies - `yarn` -> `npm install`
* Run script - `yarn <script>` -> `npm run <script>`

**Installing and Running application**

1. Clone repo to a local directory, we'll call it `~/crossed-wires`.
2. Change into cloned repo directory: `cd ~/crossed-wires`.
2. Run `yarn` to install server dependencies.
5. Start server `node src`.


**Building API Documentation**

Run script `yarn generate-docs`

**Hosting API Documentation**

Run script `yarn host-docs`

Once docs are hosted, you may view them in your web browser at
http://localhost:8000/crossed-wires-server/0.0.5/index.html
