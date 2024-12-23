const jwt = require('jsonwebtoken')
module.exports.createToken = async (data) => {
    // id, role 和 SECRET 用來製作 jwt 簽章 
    const token = await jwt.sign(data, process.env.SECRET, {
        expiresIn: '7d'
    })
    return token
}