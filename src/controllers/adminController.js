const connectionDB = require("../config/connection");
const { db_sql, dbScript } = require('../utils/db_scripts');
const bcrypt = require("bcrypt");
const { genSaltSync, hashSync } = require("bcrypt");
const sendEmail = require("../utils/sendEmail");
const { issueJWT } = require("../utils/jwtToken");
const { mysql_real_escape_string } = require('../utils/helper')

//api to add admin
module.exports.createAdmin = async (req, res) => {
    try {
        let { name, email, password, contactnumber } = req.body
        const data = (name == '' || email == '' || password == '' || contactnumber == '')
        if (data) {
            res.status(400).json({
                success: false,
                message: "please Enter required filed"
            });
        } else {
            let pic = req.file
            //  console.log(pic.originalname);
            //  console.log(name, email, password, contactnumber)
            let s1 = dbScript(db_sql['Q17'], { var1: email })
            // console.log(s1);
            let findadmin = await connectionDB.query(s1)
            // console.log(findadmin.rows.length)

            if (findadmin.rows.length == 0) {
                const soltRounds = 15;
                const saltPassword = await genSaltSync(soltRounds);
                const hashPassword = await hashSync(password, saltPassword);
                // console.log(hashPassword);

                let s2 = dbScript(db_sql['Q18'], { var1: mysql_real_escape_string(name), var2: mysql_real_escape_string(email.toLowerCase()), var3: hashPassword, var4: contactnumber, var5: pic.originalname })
                // console.log(s2)
                let addadmin = await connectionDB.query(s2)
                // console.log(addadmin.rows)
               
                res.status(201).json({
                    success: true,
                    message: "admin added successfully",
                    data: addadmin.rows
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "admin already exist"
                });
            }
        }
    } catch (error) {
        res.json({
            status: 500,
            success: false,
            Message: error.message
        })
    }
}

//api to login admin
module.exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (email == "" || password == "") {
            res.status(400).json({
                success: false,
                message: "please enter email or password"
            });
        } else {
            // console.log(email, password);
            let s1 = dbScript(db_sql['Q17'], { var1: email })
            // console.log(s1);
            let findadmin = await connectionDB.query(s1)
            // console.log(findadmin.rows.length)
            // console.log(findadmin.rows[0].password);// this is hased password

            if (findadmin.rows.length == 1) {
                const checkPassword = await bcrypt.compare(password, findadmin.rows[0].password);
                // console.log(checkPassword)
                if (checkPassword == true) {
                    
                        let payload1 = {
                            id: findadmin.rows[0].admins_id,
                            email: findadmin.rows[0].email,
                        };
                        let token = await issueJWT(payload1);
                        // console.log(token);
                        var time = new Date().toISOString();

                        //to find ip address from where admin logedin
                        var ip = (req.headers['x-forwarded-for'] || '')
                            .split(',').pop().trim() ||
                            req.connection.remoteAddress ||
                            req.socket.remoteAddress ||
                            req.connection.socket.remoteAddress;
                        // console.log(ip)

                        var device = req.headers["user-agent"]
                        // console.log(device)
                        
                        let s2 = dbScript(db_sql['Q19'], { var1: findadmin.rows[0].admins_id, var2: time, var3: true, var4: token, var5: device,var6:ip })
                        //  console.log(s1);
                        let saveToken = await connectionDB.query(s2)

                        res.status(201).json({
                            message: "login successfully",
                            token,
                        });
                   
                } else {
                    res.status(400).json({
                        success: false,
                        message: "please enter correct password"
                    });
                }
            } else {
                res.status(400).json({
                    success: false,
                    message: "user not exixt"
                });
            }
        }
    } catch (error) {
        res.json({
            status: 500,
            success: false,
            Message: error.message
        })
    }
}
