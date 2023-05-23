const jwt = require('jsonwebtoken');
const User = require('../models/users');
const {secret} = require('../config');

class UserCtl {
    async login(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: true},
            password: {type: 'string', required: true}
        });
        const user = await User.findOne(ctx.request.body);
        if (!user) {
            ctx.throw(401, '用户名或密码不正确');
        }
        const {_id, name} = user;
        // expiresIn: '1d' 过期时间1天
        const token = jwt.sign({_id, name}, secret, {expiresIn: '1d'});
        ctx.body = {token};
    }

    async findAll(ctx) {
        ctx.body = await User.find();
    }

    async findById(ctx) {
        const {fields} = ctx.query;
        // 'educations;bussines' => mongodb语法 '+educations+bussines'
        // filter过滤空值
        const selectFields = fields.split(';').filter(field => field).map(field => ' +' + field).join('');
        const user = await User.findById(ctx.params.id).select(selectFields);
        if (!user) {
            ctx.throw(404, '用户不存在');
        }
        ctx.body = user;
    }

    async create(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: true}, // required默认true
            password: {type: 'string', required: true}
        });
        const {name} = ctx.request.body;
        const exists = await User.findOne({name});
        if (exists) {
            ctx.throw(409, '用户名已被占用');
        }
        const user = await new User(ctx.request.body).save();
        ctx.body = user;
    }

    async checkOwner(ctx, next) {
        if (ctx.params.id !== ctx.state.user._id) {
            ctx.throw(403, '没有权限');
        }
        await next();
    }

    async update(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: false},
            password: {type: 'string', required: false},
            avatar_url: {type: 'string', required: false},
            gender: {type: 'string', required: false},
            headline: {type: 'string', required: false},
            locations: {type: 'array', itemType: 'string', required: false},
            bussiness: {type: 'string', required: false},
            employments: {type: 'array', itemType: 'object', required: false},
            educations: {type: 'array', itemType: 'object', required: false}
        });
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if (!user) {
            ctx.throw(404, '用户不存在');
        }
        ctx.body = user;
    }

    async del(ctx) {
        const user = await User.findByIdAndRemove(ctx.params.id);
        if (!user) {
            ctx.throw(404, '用户不存在');
        }
        ctx.status = 204;
    }

    async listFollowing(ctx) {
        const user = await User.findById(ctx.params.id).select('+following').populate('following');
        if (!user) {
            ctx.throw(404, '用户不存在');
        }
        ctx.body = user.following;
    }

    async listFollowers(ctx) {
        const users = await User.find({following: ctx.params.id});
        ctx.body = users;
    }

    async checkUserExist(ctx, next) {
        const user = await User.findById(ctx.params.id);
        if (!user) {
            ctx.throw(404, '用户不存在');
        }
        await next();
    }

    async follow(ctx) {
        const user = await User.findById(ctx.state.user._id).select('+following');
        if (!user.following.map(id => id.toString()).includes(ctx.params.id)) {
            user.following.push(ctx.params.id);
            user.save();
        }
        ctx.status = 204;
    }

    async unfollow(ctx) {
        const user = await User.findById(ctx.state.user._id).select('+following');
        const idx = user.following.map(id => id.toString()).indexOf(ctx.params.id);
        if (idx > -1) {
            user.following.splice(idx, 1);
            user.save();
        }
        ctx.status = 204;
    }
}

module.exports = new UserCtl(); 