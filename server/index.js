'use strict'

const Koa = require('koa')
const Cors = require('koa2-cors');

const Names = require('./names.js')
const Questions = require('./questions')
const Robots = require('./robots')
const Sessions = require('./sessions')
const Utils = require('./utils')

const PORT = 8080

let app = new Koa()
let router = new (require('koa-trie-router'))()

// Log call and time
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// Pretty print option
app.use(async (ctx, next) => {
    await next()
    if (ctx.query.pretty === '1') {
        ctx.body = JSON.stringify(ctx.body, null, 4)
    }
})

// Handle errors
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.log('Error: ')
        console.log(err)
        ctx.throw(err.status || 500, err.message)
        ctx.app.emit('error', err, ctx);
    }
  });

// Enable Cross-Origin Resource Sharing
app.use(Cors())


/* Routes */

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

router.get('/login',
    async (ctx, next) => {
        ctx.body = {
            handle: Names.next(),
            robots: Robots.list()
        }
    }
)

router.post('/login',
    async (ctx, next) => {
        let post = await Utils.getBody(ctx)
        ctx.body = { session: Sessions.login(post) }
    }
)


app.use(router.middleware())
app.listen(PORT)

console.log(`Listening on localhost port ${PORT}`)
