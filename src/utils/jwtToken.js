
const jsonwebtoken = require("jsonwebtoken");

const jwt = {
    //create token
    issueJWT: async user => {
        let payload = {
            id: user.id,
            email: user.email
        };
        const options = {
            expiresIn: '2h'
        };
        //console.log(payload,'payload')
        const jwtToken = await jsonwebtoken.sign(payload, 'KEy', options);
        return jwtToken;  
    },
    //verify Token 
    verifyTokenFn: async (req, res, next) => {
        var token = req.headers.authorization
        //  console.log(token)
        await jsonwebtoken.verify(token, 'KEy', function (err, decoded) {
            if (err) {
                return res.json({
                    status: false,
                    statusCode: false,
                    message: "Token not found or token expired",
                });
            } else {
                // console.log(decoded.id,decoded.email,'222');
                req.user = {
                    token:token,
                    id: decoded.id,
                    email: decoded.email
                }
                return next();
            }
        });
    }
};
module.exports = jwt;