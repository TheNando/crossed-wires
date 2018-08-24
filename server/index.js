'use strict'

const Koa = require('koa')
const Cors = require('koa2-cors')

const Middleware = require('./middleware.js')
const Names = require('./names.js')
const Questions = require('./questions')
const Robots = require('./robots')
const Sessions = require('./sessions')

const PORT = 8080

let app = new Koa()
let router = new (require('koa-trie-router'))()

app.use(Middleware.parseBody)
app.use(Middleware.applyAuthToken)
app.use(Middleware.logRequest)
app.use(Middleware.prettyPrint)
app.use(Middleware.handleErrors)
app.use(Cors())

/* Routes */

router.get('/login', async (ctx, next) => {
  ctx.body = {
    handle: Names.next(),
    robots: Robots.list(),
    time: Date.now(),
  }
})

router.get('/time', async (ctx, next) => {
  ctx.body = {
    time: Date.now(),
  }
})

router.post('/login', async (ctx, next) => {
  ctx.body = { session: Sessions.login(ctx.req.body) }
})

router.post('/answer', async (ctx, next) => {
  Questions.answer(ctx.req.sessionId, ctx.req.body)
  ctx.status = 204
})

app.use(router.middleware())
app.listen(PORT)

console.log(`Listening on localhost port ${PORT}`)

// router.get('/admin/save-questions',
//     async (ctx, next) => {
//         Questions.save()
//         ctx.body = 'Questions saved'
//     }
// )

// router.get('/admin/info',
//     async (ctx, next) => {
//         ctx.body = {
//             questions: Questions.info(),
//             robots: Teams.info()
//         }
//     }
// )

// router.post('/names/generate',
//     async (ctx, next) => {
//         ctx.body = Names.generate()
//     }
// )

// router.get('/robots',
//     async (ctx, next) => {
//         ctx.body = Robots.list()
//     }
// )

// router.post('/robots',
//     async (ctx, next) => {
//         let post = await Utils.getBody(ctx)
//         ctx.body = Robots.add(post.name, post.team, post.color)
//     }
// )

// router.get('/question',
//     async (ctx, next) => {
//         ctx.body = Questions.get()
//     }
// )
