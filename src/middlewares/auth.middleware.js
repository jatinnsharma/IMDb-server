const { sendError } = require("../utils/helper");
const jwt = require('jsonwebtoken')
const User = require('../models/user.schema')


exports.isAuth = async (req, res, next) => {
    const token = req.headers?.authorization;
    const jwtToken = token.split("Bearer ")[1];

    if (!jwtToken) return sendError(res, 'Invalid token!');
    const decode = jwt.verify(jwtToken, process.env.JWT_SECRET);
    const { userId } = decode;

    const user = await User.findById(userId);
    if (!user) return sendError(res, 'Invalid token user not found!', 404);

    req.user = user;
    next();
}  