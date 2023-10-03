const express=require("express")
const router=express.Router()

router.use('/users', require('./userRouter'))
router.use('/categories',require('./categoryRouter'))
router.use('/subCategories',require('./categoryRouter'))
router.use('/admin', require('./adminRouter'))

module.exports = router;