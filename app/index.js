const Koa = require('koa');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const error = require('koa-json-error');
const parameter = require('koa-parameter');
const path = require('path');
const {MongoClient, ServerApiVersion} = require('mongodb');
const mongoose = require('mongoose');
const routing = require('./routes');
const {uri} = require('./config');

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ping: 1});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);

async function run2() {
    try {
        mongoose.set('strictQuery', false);
        mongoose.connect(uri);
        console.log('mongodb connected!');
    } catch (error) {
        console.log(error);
        process.exit();
    }
}

run2().catch(console.error);

const app = new Koa();
const PORT = 8080;

app.use(koaStatic(path.join(__dirname, '/public')));
app.use(error({
    postFormat: (err, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
}));
app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, '/public/uploads'),
        keepExtensions: true,
    }
}));
app.use(parameter(app)); // 传入app，可以在ctx中加入方法，全局使用
routing(app);

app.listen(PORT, () => {
    console.log(`tarting on ${PORT}`);
});