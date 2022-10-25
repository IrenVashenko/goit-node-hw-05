const jwt = require("jsonwebtoken");

const {SECRET_KEY} = process.env;

const {User} = require("../mod/user");

const authenticate = async(req, res, next) => {
    try{
        const {authorization} = req.headers;
        const [bearer, token] = authorization.split(" ");
        if(bearer !== "Bearer") {
            const error = new Error(`Error`)
            error.status = 401;
            throw error;
        }
        const {id} = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);
        if(!user || !user.token || user.token !== token) {
            const error = new Error(`Don't find user by id `)
            error.status = 401;
            throw error;
        }
        req.user = user;
        next();
    } catch(error) {
        if(!error.status) {
            error.status = 401;
            error.message = "Unauthorized";
        }
        next(error)
    }
}

module.exports = authenticate;