
const multer = require('multer')
const path = require('path')

// for uploading users profile pic
const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/usersProfilepic')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const uploadprofilepicture = multer({
    storage: storage1
})

// for category and subcategory icon
const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/cat&subcatIcon')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const uploadCatAndSubcatIcon = multer({
    storage: storage2
})

// for uploading admins profile pic
const storage3 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/adminsProfilepic')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const uploadprofilepic = multer({
    storage: storage3
})

module.exports = {

    uploadprofilepicture,
    uploadCatAndSubcatIcon,
    uploadprofilepic

};