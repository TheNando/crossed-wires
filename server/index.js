'use strict'

const _ = require('lodash')
const Koa = require('koa')
const Questions = new (require('./questions'))()
const Sessions = new (require('./sessions'))()
const Teams = new (require('./teams'))()
const Utils = require('./utils')

let app = new Koa()
let router = new (require('koa-trie-router'))()

// Log call and time
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
})

// Pretty print option
app.use(async (ctx, next) => {
  await next();
  if (ctx.query.pretty === '1') {
      ctx.body = JSON.stringify(ctx.body, null, 4)
  }
})

router.get('/admin/save-questions',
    async function (ctx, next) {
        Questions.save()
        ctx.body = 'Questions saved'
    }
)

router.get('/admin/info',
    async function  (ctx, next) {
        ctx.body = {
            questions: Questions.info(),
            teams: Teams.info()
        }
    }
)

router.post('/login',
    async function (ctx, next) {
        let post = await Utils.getBody(ctx)
        ctx.body = Sessions.newUser(post.email)
    }
)

router.get('/question',
    async function (ctx, next) {
        ctx.body = Questions.get()
    }
)

router.post('/teams',
    async function (ctx, next) {
        let post = await Utils.getBody(ctx)
        ctx.body = Teams.newTeam(post.name, post.color)
    }
)


app.use(router.middleware())
app.listen(3000)

console.log('Listening on localhost port 3000')
