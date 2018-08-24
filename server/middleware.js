'use strict'

const rxToken = /Token (.*)/i
const bodyMethods = ['POST', 'PUT']

/** Class containing API server middleware methods. */
class Middleware {
  constructor() {}

  /**
   * Store session ID for easy access
   */
  static async applyAuthToken(ctx, next) {
    if (ctx.request.method === 'OPTIONS' || ctx.request.url === '/login') {
      return next()
    }

    const userToken = (ctx.request.header.authorization || '').match(rxToken)
    ctx.req.sessionId = userToken[1]

    await next()
  }

  /**
   * Catch and handle API request errors
   */
  static async handleErrors(ctx, next) {
    try {
      await next()
    } catch (err) {
      console.log('Error: ', err)
      ctx.throw(err.status || 500, err.message)
      ctx.app.emit('error', err, ctx)
    }
  }

  /**
   * Logs an API request to console
   */
  static async logRequest(ctx, next) {
    const start = new Date()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
    await next()
  }

  /**
   * Retrieve context request data payload as object
   */
  static async parseBody(ctx, next) {
    if (!bodyMethods.includes(ctx.request.method)) {
      return next()
    }

    ctx.req.body = await new Promise(function(resolve, reject) {
      let data = ''
      ctx.req.on('data', (chunk) => (data += chunk))
      ctx.req.on('end', (chunk) => resolve(JSON.parse(data)))
    })

    await next()
  }

  /**
   * Format request response string whitespace
   */
  static async prettyPrint(ctx, next) {
    if (ctx.query.pretty === '1') {
      ctx.body = JSON.stringify(ctx.body, null, 4)
    }
    await next()
  }
}

module.exports = Middleware
