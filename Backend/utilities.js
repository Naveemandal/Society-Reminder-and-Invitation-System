const jwt =require("jsonwebtoken")

function authenticateToken(req , res , next) {
    const authHeader = req.headers['authorization']
    console.log("authHeader",authHeader);
    
    const token = authHeader && authHeader.split(" ")[1];
    console.log("token",token);

    if(!token) return res.sendStatus(401);
console.log("firdos",process.env.ACCESS_SECRET_TOKEN);

    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err , user) => {
        if (err) return res.sendStatus(401);
        req.user=user;
        next();
       });
}

module.exports ={
    authenticateToken
}