'use strict'

const _ = require('lodash')
const Koa = require('koa')
const Names = require('./names')
const Questions = new (require('./questions'))()

let app = new Koa()
let router = new (require('koa-trie-router'))()

// Log call and time
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// Pretty print option
app.use(async (ctx, next) => {
  await next();
  if (ctx.query.pretty === '1') {
      ctx.body = JSON.stringify(ctx.body, null, 4)
  }
});

router.get('/admin/save-questions',
    async function (ctx, next) {
        Questions.save()
        ctx.body = 'Questions saved'
    }
)

router.get('/admin/info',
    async function  (ctx, next) {
        ctx.body = Questions.info()
    }
)

router.get('/question',
    async function (ctx, next) {
        ctx.body = Questions.current()
    }
)

router.get('/login',
    async function (ctx, next) {
        ctx.body = `Hello ${ Names.generate() }`
    }
)


app.use(router.middleware())
app.listen(3000)
