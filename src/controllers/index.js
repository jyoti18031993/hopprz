const users = require("./userController")
const categories= require("./categoryController")
const subCategories=require("./subCategoryController")
const admin = require('./adminController')
const controller={

    users,
    categories,
    subCategories,
    admin
}

module.exports=controller