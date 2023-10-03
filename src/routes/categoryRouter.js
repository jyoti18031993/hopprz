const express = require('express')
var router = express.Router()
var controller = require('../controllers/index')
const { verifyTokenFn } = require("../utils/jwtToken")
const { uploadCatAndSubcatIcon } = require("../utils/uploadfiles")

//route for category
router.post('/addCategory',verifyTokenFn,uploadCatAndSubcatIcon.single('iconname'),controller.categories.addCategory)
router.get('/findAllCategories',verifyTokenFn,controller.categories.findListOfCategories)
router.delete('/deleteCategory',verifyTokenFn,controller.categories.deleteCategory)
router.put('/updateCategory/:id',verifyTokenFn,controller.categories.updateCategory)

//route for subcategory
router.post('/addSubcategory',verifyTokenFn,uploadCatAndSubcatIcon.single('iconname'),controller.subCategories.addsubCategory)
router.get('/findAllSubCategories',verifyTokenFn,controller.subCategories.findListOfSubCategories)
module.exports = router;
