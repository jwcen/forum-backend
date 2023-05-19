const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();

router.get('/', (ctx) => {
    ctx.body = 'home';
});

router.post('/users', (ctx) => {
    ctx.body = 'create user';
});

router.get('/users/:id', (ctx) => {
    ctx.body = `this is user: ${ctx.params.id}`;
});

app.use(router.routes());

app.listen(8080);