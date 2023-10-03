const connectionDB = require("../config/connection");
const { db_sql, dbScript } = require('../utils/db_scripts');
const { mysql_real_escape_string } = require('../utils/helper')

//api to add a new category
module.exports.addCategory = async (req, res) => {
    try {
        let { name, description } = req.body
        var iconname = req.file
        const data = (name == '' || description == '' || iconname == "")
        if (data) {
            res.status(400).json({
                success: false,
                message: "please Enter required filed"
            });
        } else {
            let { id } = req.user
            // console.log(id);
            let s1 = dbScript(db_sql['Q20'], { var1: id })
            // console.log(s1);
            let findadmin = await connectionDB.query(s1)
            // console.log(findadmin.rows)

            let s2 = dbScript(db_sql['Q12'], { var1: name })
            // console.log(s1);
            let findcategory = await connectionDB.query(s2)
            // console.log(findcategory.rows.length)

            if (findcategory.rows.length == 0) {
                // console.log(name, description);
                // console.log(iconname.originalname)


                let s3 = dbScript(db_sql['Q11'], { var1: mysql_real_escape_string(name), var2: iconname.originalname, var3: mysql_real_escape_string(description), var4: findadmin.rows[0].name })
                // console.log(s2);

                let addcategory = await connectionDB.query(s3)
                // console.log(addcategory.rows)
                res.status(201).json({
                    success: true,
                    message: "category added successfully",
                    data: addcategory.rows
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "categoty already added"
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

// api of list of categories
module.exports.findListOfCategories = async (req, res) => {
    try {

        let s1 = dbScript(db_sql['Q16'])
        // console.log(s1);

        let findAllCategories = await connectionDB.query(s1)
        let categories = [];
        for (let row of findAllCategories.rows) {
            console.log(row.name);
            categories.push({ categoryName: row.name })
        }
        // var AllCategories=findAllCategories.rows.map(row => row.name)

        res.status(201).json({
            success: true,
            message: "All Categories are",
            data: categories
        })
    } catch (error) {
        res.json({
            status: 400,
            success: false,
            Message: error.message
        })
    }
}

//api to delete the category
module.exports.deleteCategory = async (req, res) => {
    try {
        let { name } = req.body;

        let s2 = dbScript(db_sql['Q12'], { var1: name })
        console.log(s2);
        let findcategory = await connectionDB.query(s2)
        console.log(findcategory.rows)
        if (findcategory.rows[0].is_deleted == null) {
            //  console.log(findcategory.rows[0].parent_id);
            if (findcategory.rows.length == 1 && findcategory.rows[0].parent_id == null) {

                let { id } = req.user
                let s1 = dbScript(db_sql['Q20'], { var1: id })
                var findadmin = await connectionDB.query(s1)

                var time = new Date().toISOString();
                let s3 = dbScript(db_sql['Q21'], { var1: 1, var2: time, var3: findadmin.rows[0].name, var4: name })
                console.log(s3);
                let deletecategory = await connectionDB.query(s3)
                console.log(deletecategory.rows)

                res.status(201).json({
                    success: true,
                    message: `category ${name} is deleted successfully`,

                })
            } else {
                res.status(400).json({
                    success: false,
                    message: `category ${name} is not available `
                })
            }
        } else {
            res.status(400).json({
                success: false,
                message: `category ${name} is already deleted`
            })
        }
    } catch (error) {
        res.json({
            status: 400,
            success: false,
            Message: error.message
        })
    }
}

//api to update the category
module.exports.updateCategory = async (req, res) => {
    try {
        let {id} = req.params
        console.log(id)
        let { name, description } = req.body
        var iconname = req.file
        const data = (name == '' || description == '' || iconname == "")
        if (data) {
            res.status(400).json({
                success: false,
                message: "please Enter required filed"
            });
        } else {
            let { id } = req.user
            let s1 = dbScript(db_sql['Q20'], { var1: id })
            var findadmin = await connectionDB.query(s1)
            console.log(findadmin.rows)
// now update
            let s2 = dbScript(db_sql['Q21'], { var1: id })
            var findadmin = await connectionDB.query(s2)
            
        }


    } catch (error) {
        res.json({
            status: 400,
            success: false,
            Message: error.message
        })
    }
}


