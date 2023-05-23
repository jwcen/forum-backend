const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const userSchema = new Schema({
    __v: {
        type: Number,
        select: false
    }, // 隐藏无用返回
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    }, // 默认不暴露密码
    avatar_url: {
        type: String
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: 'male',
        require: true
    },
    headline: {
        type: String,
        default: '这个人很懒，什么也没留下～'
    },
    locations: {
        type: [{type: String}],
        select: false
    },
    bussiness: {
        type: String,
        select: false
    },
    employments: {
        type: [{
            company: {type: String},
            job: {type: String}
        }],
        select: false
    },
    educations: {
        type: [{
            school: {type: String},
            majoy: {type: String},
            diploma: {type: Number, enum: [1, 2, 3, 4, 5]},
            entrance_year: {type: Number},
            graduation_year: {type: Number}
        }],
        select: false
    },
    following: {
        type: [{type: Schema.Types.ObjectId, ref: 'User'}],
        select: false
    }
});

module.exports = model('User', userSchema);