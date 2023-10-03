const express = require('express')
var router = express.Router()
var controller = require('../controllers/index')
const { verifyTokenFn } = require("../utils/jwtToken")
const { uploadprofilepic } = require("../utils/uploadfiles")

router.post('/createAdmin', uploadprofilepic.single('profilepicture'),controller.admin.createAdmin)
router.post('/login',controller.admin.login)

module.exports = router;