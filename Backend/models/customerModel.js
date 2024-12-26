const { Schema, model } = require("mongoose");
const customerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    method: {
        type: String,
        required: true
    },
}, { timestamps: true })
module.exports = model('customers', customerSchema) // model 方法返回的實際上是一個構造函數（Constructor Function）。這個函數可以用來創建新的文檔（Document）實例。