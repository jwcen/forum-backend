const db = [{ name: 'user1' }, { name: 'user2' }];

class UserCtl {
    findAll(ctx) {
        ctx.body = db;
    }

    findById(ctx) {
        if (ctx.params.id * 1 >= db.length) {
            ctx.throw(412, 'ID大于数组长度')
        }
        ctx.body = db[ctx.params.id * 1];
    }

    create(ctx) {
        ctx.verifyParams({
            name: {type: 'string'}, // required默认true
            age: {type: 'number', required: false}
        });
        db.push(ctx.request.body);
        ctx.body = ctx.request.body;
    }

    update(ctx) {
        if (ctx.params.id *1 >= db.length) {
            ctx.throw(412, 'ID大于数组长度');
        }
        db[ctx.params.id * 1] = ctx.request.body;
        ctx.body = ctx.request.body;
    }

    del(ctx) {
        if (ctx.params.id *1 >= db.length) {
            ctx.throw(412, 'ID大于数组长度');
        }
        db.splice(ctx.params.id * 1, 1);
        ctx.status = 204;
    }
}

module.exports = new UserCtl(); 