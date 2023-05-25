const Topic = require('../models/topics');

class TopicsCtl {
    async find(ctx) {
        ctx.body = await Topic.find();
    }

    async findById(ctx) {
        const {fields = ''} = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => '+' + f).join('');
        ctx.body = await Topic.findById(ctx.params.id).select(selectFields);
    }

    async add(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: true},
            avatar_url: {type: 'string', required: false},
            introduction: {type: 'string', required: false}
        });
        ctx.body = await new Topic(ctx.request.body).save();
    }

    async update(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: false},
            avatar_url: {type: 'string', required: false},
            introduction: {type: 'string', required: false}
        });
        ctx.body = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    }
}

module.exports = new TopicsCtl();