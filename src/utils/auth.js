const jwt = require('jsonwebtoken');

const generateAccessToken = (payload) =>{
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION});
}

// trả về payload: 1. Đúng key; 2. còn thời gian sử dụng
const verifyAccsessToken = (token)=>{
    try{
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error){
        return null;
    }
}

module.exports = {
    generateAccessToken,
    verifyAccsessToken
}