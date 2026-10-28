const jwt = require("jsonwebtoken");

function authenticateToken(req,res,next){
    const authHeader = req.headers["authorization"]; //reads authorization header

    //checking token is provided or not
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({                 //401- missing
            error: "Access denied. Token required."
        });
    }

    //verifying token
    jwt.verify(token, process.env.JWT_SECRET, (err,user) => {
        if(err){
            return res.status(403).json({               //403- invalid or expired
                error: "Invalid or expired token."
            });
        }

        req.user = user; //user makes token verified info avail to route
        next();           //allows the request to continue to the API handler.
    });
}

module.exports = authenticateToken;


//jwt token 
//node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

//hash generation for pass
//node -e "require('bcryptjs').hash('YourTrainingPassword123!', 10).then(console.log)"