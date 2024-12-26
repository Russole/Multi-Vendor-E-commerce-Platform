const jwt = require('jsonwebtoken');
module.exports.authMiddleware = async (req, res, next) => {

    const { accessToken } = req.cookies;
    if (!accessToken) {
        return res.status(409).json({ error: 'Please Login First' });
    } else {
        try {
            const deCodeToken = await jwt.verify(accessToken, process.env.SECRET);// 驗證請求中 cookie 所帶的 cookie
            req.role = deCodeToken.role;// 解token後得到role
            req.id = deCodeToken.id;// 解token後得到id
            next();
        } catch (error) {
            return res.status(409).json({ error: 'Please Login' });
        }
    }
}