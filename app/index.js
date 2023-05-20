const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const error = require('koa-json-error');
const parameter = require('koa-parameter');
const routing = require('./routes');

const app = new Koa();
const PORT = 8080;

app.use(error({
    postFormat: (err, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}));

app.use(bodyparser());
app.use(parameter(app)); // 传入app，可以在ctx中加入方法，全局使用
routing(app);

app.listen(PORT, () => {
    console.log(`tarting on ${PORT}`);
});