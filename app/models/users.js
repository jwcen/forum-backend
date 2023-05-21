const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true }, 
    // password: {type: String, required: true, select: false}, // 默认不暴露密码
    __v: { type: Number, select: false} // 隐藏无用返回
});

module.exports = model('User', userSchema);