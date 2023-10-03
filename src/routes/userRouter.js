const express = require('express')
var router = express.Router()
var controller = require('../controllers/index')
const { verifyTokenFn } = require("../utils/jwtToken")
const { uploadprofilepicture } = require("../utils/uploadfiles")

router.post('/createUser', uploadprofilepicture.single('profile_picture'), controller.users.createUser)
router.post('/resendOtp', controller.users.resendOtp)
router.put('/verifyuser', controller.users.verifyuser)
router.post('/login',controller.users.login)
router.put('/changePassword',verifyTokenFn,controller.users.changePassword)
router.delete('/deleteuser',verifyTokenFn,controller.users.deleteuser)
router.get('/profile',verifyTokenFn,controller.users.profile)
router.patch('/updateProfile',verifyTokenFn,controller.users.updateprofile)
router.post('/forgotpassword',controller.users.forgotpassword)
router.put('/forgotandchangepassword',controller.users.forgotandchangepassword)

module.exports = router;
