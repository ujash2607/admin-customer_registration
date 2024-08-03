const jwt = require("jsonwebtoken");

const authorized = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log("You need token");
        return res.status(400).send({success: false, msg: "You need token"});
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            console.log("Invalid token");
            return res.status(400).send("Invalid token");
        }
        req.user = user;
        next();
    });
}

module.exports = authorized;
