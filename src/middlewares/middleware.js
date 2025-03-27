const auth = require('../utils/auth');

const checkAuth = (req, res, next) =>{
    // const token = req.headers.authorization?.split(' ')[1];
    const token = req.cookies.accessToken;
    const checkUser = auth.verifyAccsessToken(token);
    if (!checkUser){
        return res.status(403).json('Chưa đăng nhập');
    }
    next();
}


module.exports = {
    checkAuth
}