const connectionDB = require("../config/connection");
const { db_sql, dbScript } = require('../utils/db_scripts');
const bcrypt = require("bcrypt");
const { genSaltSync, hashSync } = require("bcrypt");
const sendEmail = require("../utils/sendEmail");
const { issueJWT } = require("../utils/jwtToken");
const { mysql_real_escape_string } = require('../utils/helper')

//api of create user
module.exports.createUser = async (req, res) => {
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
            // console.log(pic.originalname);
            // console.log(name, email, password, contactnumber)

            let s1 = dbScript(db_sql['Q1'], { var1: email })
            console.log(s1);
            let findUser = await connectionDB.query(s1)
            console.log(findUser.rows.length)

            if (findUser.rows.length == 0) {
                const soltRounds = 15;
                const saltPassword = await genSaltSync(soltRounds);
                const hashPassword = await hashSync(password, saltPassword);
                // console.log(hashPassword);

                var newOtp = Math.floor(Math.random() * 100000);
                // console.log(newOtp);

                let s2 = dbScript(db_sql['Q2'], { var1: mysql_real_escape_string(name), var2: mysql_real_escape_string(email.toLowerCase()), var3: hashPassword, var4: contactnumber, var5: pic.originalname, var6: newOtp })
                // console.log(s2)
                let adduser = await connectionDB.query(s2)
                console.log(adduser.rows)
                await sendEmail(email, newOtp, name);

                res.status(201).json({
                    success: true,
                    message: "user added successfully",
                    data: adduser.rows
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "user already exist"
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

//api of resend otp
module.exports.resendOtp = async (req, res) => {
    try {
        let { email } = req.body
        // console.log(email)
        let s1 = dbScript(db_sql['Q1'], { var1: email })
        //  console.log(s1);
        let findUser = await connectionDB.query(s1)
        //  console.log(findUser.rows.length)
        if (findUser.rows.length == 1) {
            var newOtp = Math.floor(Math.random() * 100000);
            //  console.log(newOtp);
            // console.log(findUser.rows[0].name)
            sendEmail(email, newOtp, findUser.rows[0].name);
            var time = new Date().toISOString();
            let s1 = dbScript(db_sql['Q3'], { var1: newOtp, var2: time, var3: email })
            //   console.log(s1);
            let updateOtp = await connectionDB.query(s1)

            res.status(201).json({
                success: true,
                message: "resend otp successfully",
                data: updateOtp.rows
            });
        } else {
            res.status(400).json({
                success: false,
                message: "user not exist"
            });
        }
    } catch (error) {
        res.json({
            status: 500,
            success: false,
            Message: error.message
        })
    }
}

//api of verify user
module.exports.verifyuser = async (req, res) => {

    try {
        let { email, otp } = req.body;
        const data = (email == '' || otp == '')
        if (data) {
            res.status(400).json({
                success: false,
                message: "please Enter required filed"
            });

        } else {
            // console.log(email,otp);
            let s1 = dbScript(db_sql['Q1'], { var1: email })
            //   console.log(s1);
            let findUser = await connectionDB.query(s1)
            //   console.log(findUser.rows.length)
            // console.log(findUser.rows[0].otp);
            if (findUser.rows.length == 1 && findUser.rows[0].is_verified == true) {
                res.status(400).json({
                    success: false,
                    message: "you are alreadey verified"
                });
            } else if (findUser.rows.length == 1 && findUser.rows[0].is_verified == false) {

                if (findUser.rows[0].otp == otp) {
                    var time = new Date().toISOString();
                    let s1 = dbScript(db_sql['Q4'], { var1: "true", var2: "null", var3: time, var4: email })
                    // console.log(s1);
                    let verified = await connectionDB.query(s1)

                    res.status(201).json({
                        success: true,
                        message: "user verified successfully",
                        data: verified.rows
                    });
                } else {
                    res.status(400).json({
                        success: false,
                        message: "please enter correct otp"
                    });
                }
            } else if (findUser.rows.length == 0) {
                res.status(400).json({
                    success: false,
                    message: "user not exist"
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

//api of login
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
            let s1 = dbScript(db_sql['Q1'], { var1: email })
            // console.log(s1);
            let findUser = await connectionDB.query(s1)
            // console.log(findUser.rows.length)
            // console.log(findUser.rows[0].password);// this is hased password

            if (findUser.rows.length == 1) {
                const checkPassword = await bcrypt.compare(password, findUser.rows[0].password);
                // console.log(checkPassword)
                if (checkPassword == true) {
                    // console.log(findUser.rows[0].is_verified)
                    if (findUser.rows[0].is_verified == true) {
                        let payload1 = {
                            id: findUser.rows[0].users_id,
                            email: findUser.rows[0].email,
                        };
                        let token = await issueJWT(payload1);
                        //console.log(token);
                        var time = new Date().toISOString();
                        var ip = (req.headers['x-forwarded-for'] || '')
                            .split(',').pop().trim() ||
                            req.connection.remoteAddress ||
                            req.socket.remoteAddress ||
                            req.connection.socket.remoteAddress;
                        // console.log(ip)

                        var device = req.headers["user-agent"]
                        // console.log(device)
                        // let s1 = dbScript(db_sql['Q10'], { var1: token, var2: time, var3: email })
                        let s1 = dbScript(db_sql['Q10'], { var1: findUser.rows[0].users_id, var2: time, var3: true, var4: token, var5: device, var6: ip })
                        //  console.log(s1);
                        let saveToken = await connectionDB.query(s1)

                        res.status(201).json({
                            message: "login successfully",
                            token,
                        });
                    } else {
                        res.status(400).json({
                            success: false,
                            message: "please verify yourself first"
                        });
                    }
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

//api of change password
module.exports.changePassword = async (req, res) => {
    try {
        let { id, email } = req.user
        // console.log(id, email);
        let s1 = dbScript(db_sql['Q5'], { var1: id })
        // console.log(s1);
        let findUser = await connectionDB.query(s1)
        //    console.log(findUser.rows.length)
        //console.log(findUser.rows[0].password);
        if (findUser.rows.length == 1) {
            if (findUser.rows[0].is_deleted > 0) {
                res.status(400).json({
                    success: false,
                    message: "you are not eligible to access this app"
                });
            } else {
                let { oldpassword, newPassword, confirmPassword } = req.body;
                var data = oldpassword == '' || newPassword == '' || confirmPassword == '';
                if (data) {
                    res.status(400).json({
                        success: false,
                        message: "please Enter required filed"
                    });
                } else {
                    var checkPassword = await bcrypt.compare(oldpassword, findUser.rows[0].password);
                    // console.log(checkPassword);
                    if (checkPassword == true) {
                        if (newPassword == confirmPassword) {
                            const soltRounds = 15;
                            const saltPassword = await genSaltSync(soltRounds);
                            const hashPassword = await hashSync(newPassword, saltPassword);
                            //  console.log(hashPassword);
                            var time = new Date().toISOString();
                            let s1 = dbScript(db_sql['Q6'], { var1: hashPassword, var2: time, var3: id })
                            //  console.log(s1);
                            let updatePassword = await connectionDB.query(s1)

                            res.status(201).json({
                                success: true,
                                message: "your password reset successfully",
                                data: updatePassword.rows
                            });

                        } else {
                            res.status(400).json({
                                success: false,
                                message: "new password and confirm password mismatched"
                            });
                        }
                    } else {
                        res.status(400).json({
                            success: false,
                            message: "please enter correct password"
                        });
                    }
                }
            }
        } else {
            res.status(400).json({
                success: false,
                message: "user not exist"
            });
        }
    } catch (error) {
        res.json({
            status: 500,
            success: false,
            Message: error.message
        })
    }
}

//api of forgot password
module.exports.forgotpassword = async (req, res) => {
    try {
        let { email } = req.body;
        // console.log(email)
        let s1 = dbScript(db_sql['Q1'], { var1: email })
        //  console.log(s1);
        let findUser = await connectionDB.query(s1)
        // console.log(findUser.rows.length);
        if (findUser.rows.length == 1) {
            var newOtp = Math.floor(Math.random() * 100000);
            // console.log(newOtp);
            sendEmail(email, newOtp, findUser.rows[0].name);
            var time = new Date().toISOString();
            let s1 = dbScript(db_sql['Q3'], { var1: newOtp, var2: time, var3: email })
            //   console.log(s1);
            let updateOtp = await connectionDB.query(s1)

            res.status(201).json({
                success: true,
                message: "resend otp successfully",
                data: updateOtp.rows
            });
        } else {
            res.status(400).json({
                success: false,
                message: "user not exist"
            });
        }
    } catch (error) {
        res.json({
            status: 500,
            success: false,
            Message: error.message
        })
    }
}

//api of forgot and change password
module.exports.forgotandchangepassword = async (req, res) => {
    try {
        let { email, otp, newPassword, confirmPassword } = req.body;
        //  console.log(email,password,otp)
        let s1 = dbScript(db_sql['Q1'], { var1: email })
        //   console.log(s1);
        let findUser = await connectionDB.query(s1)
        //  console.log(findUser.rows.length);
        // console.log(findUser.rows[0].otp)
        if (findUser.rows.length) {

            if (otp == findUser.rows[0].otp) {
                if (newPassword == confirmPassword) {
                    const soltRounds = 15;
                    const saltPassword = await genSaltSync(soltRounds);
                    const hashPassword = await hashSync(newPassword, saltPassword);
                    // console.log(hashPassword);
                    var time = new Date().toISOString();
                    let s1 = dbScript(db_sql['Q7'], { var1: hashPassword, var2: "null", var3: time, var4: email })
                    //console.log(s1);
                    let updatePassword = await connectionDB.query(s1)

                    res.status(201).json({
                        success: true,
                        message: "change password successfully",
                        data: updatePassword.rows
                    });
                } else {
                    res.status(400).json({
                        success: false,
                        message: "new password and confirm password missmatched"
                    });
                }
            } else {
                res.status(400).json({
                    success: false,
                    message: "please enter a valid otp"
                });
            }
        } else {
            res.status(400).json({
                success: false,
                message: "user not exist"
            });
        }
    } catch (error) {
        res.json({
            status: 500,
            success: false,
            Message: error.message
        })
    }
}

//api of delete user
module.exports.deleteuser = async (req, res) => {
    try {
        let { id, email } = req.user
        // console.log(id,email)
        let s1 = dbScript(db_sql['Q1'], { var1: email })
        //    console.log(s1);
        let findUser = await connectionDB.query(s1)
        //  console.log(findUser.rows.length);
        if (findUser.rows.length == 1) {
            var time = new Date().toISOString();
            let s1 = dbScript(db_sql['Q8'], { var1: 1, var2: time, var3: id })
            console.log(s1);
            let updatePassword = await connectionDB.query(s1)

            res.status(201).json({
                success: true,
                message: "user deleted successfully",
                data: updatePassword.rows
            });
        } else {
            res.status(400).json({
                success: false,
                message: "user not exist"
            });
        }
    } catch (error) {
        res.json({
            status: 500,
            success: false,
            Message: error.message
        })
    }

}

//api of get self profile
module.exports.profile = async (req, res) => {
    try {
        let { id, email } = req.user
        // console.log(id,email)
        let s1 = dbScript(db_sql['Q1'], { var1: email })
        //    console.log(s1);
        let findUser = await connectionDB.query(s1)
        //console.log(findUser.rows.length);

        if (findUser.rows.length == 1) {
            res.status(201).json({
                success: true,
                message: "user's profile",
                data: findUser.rows
            });
        } else {
            res.status(400).json({
                success: false,
                message: "user not exist"
            });
        }
    } catch (error) {
        res.json({
            status: 500,
            success: false,
            Message: error.message
        })
    }
}

//api of updateprofile
module.exports.updateprofile = async (req, res) => {
    try {
        let { id, email } = req.user
        //  console.log(id,email)
        let s1 = dbScript(db_sql['Q1'], { var1: email })
        //    console.log(s1);
        let findUser = await connectionDB.query(s1)
        // console.log(findUser.rows.length);
        if (findUser.rows.length == 1) {

            let { name, contactnumber } = req.body
            var data = (name == '' || contactnumber == '')
            if (data) {
                res.status(400).json({
                    success: false,
                    message: "please Enter required filed"
                });
            } else {
                // console.log(name,contactnumber)
                var time = new Date().toISOString();
                let s1 = dbScript(db_sql['Q9'], { var1: mysql_real_escape_string(name), var2: contactnumber, var3: time, var4: id })
                // console.log(s1);
                let updatefeilds = await connectionDB.query(s1)

                res.status(201).json({
                    success: true,
                    message: "user updated successfully",
                    data: updatefeilds.rows
                });
            }
        } else {
            res.status(400).json({
                success: false,
                message: "user not exist"
            });
        }
    } catch (error) {
        res.json({
            status: 500,
            success: false,
            Message: error.message
        })
    }
}

