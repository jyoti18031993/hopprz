const connectionDB = require("../config/connection");
const { db_sql, dbScript } = require('../utils/db_scripts');
const { mysql_real_escape_string } = require('../utils/helper')

// api to add a new subcategory
module.exports.addsubCategory = async (req, res) => {
    try {
        let { name, description, parent_id } = req.body;
        var iconname = req.file;
        const data = (name == '' || description == '' || iconname == "" || parent_id == "");

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
           
                let s2 = dbScript(db_sql['Q13'], { var1: parent_id })
                // console.log(s1);
                let findcategory = await connectionDB.query(s2)
                // console.log(findcategory.rows.length)
                if (findcategory.rows.length == 1 && findcategory.rows[0].parent_id == null) {
                    let s3 = dbScript(db_sql['Q12'], { var1: name })
                    // console.log(s2);
                    let findSubcategory = await connectionDB.query(s3)
                    // console.log(findSubcategory.rows.length)
                    if (findSubcategory.rows.length == 0) {
                        let s4 = dbScript(db_sql['Q14'], { var1: mysql_real_escape_string(name), var2: iconname.originalname, var3: mysql_real_escape_string(description), var4: parent_id, var5:findadmin.rows[0].name})
                        //  console.log(s3);

                        let addSubcategory = await connectionDB.query(s4)
                        //  console.log(addSubcategory.rows)
                        res.status(201).json({
                            success: true,
                            message: "subCategory added successfully",
                            data: addSubcategory.rows
                        });
                    } else {
                        res.status(400).json({
                            success: false,
                            message: "subCategoty already added"
                        });
                    }
                } else {
                    res.status(400).json({
                        success: false,
                        message: "Categoty is not available to add this subcategory, please add Category first"
                    });
                }
        }
    } catch (error) {
        res.json({
            status: 400,
            success: false,
            Message: error.message
        })
    }
}

// api to find all subcategories
module.exports.findListOfSubCategories = async (req, res) => {
    try {
        let { parent_id } = req.body
        let s1 = dbScript(db_sql['Q15'], { var1: parent_id })
        // console.log(s1);

        let findAllSubCategories = await connectionDB.query(s1)

        let subcategories = [];
        for (let x of findAllSubCategories.rows) {
            // console.log(x.name)
            subcategories.push({
                subCategoryName: x.name
            })
        }
        // console.log(subcategories.length)
        if (subcategories.length >= 1) {
            res.status(201).json({
                success: true,
                message: "All SubCategories are",
                data: subcategories
            });
        } else {
            res.status(400).json({
                success: false,
                message: "subCategories are not available for this category"
            });
        }
    } catch (error) {
        res.json({
            status: 400,
            success: false,
            Message: error.message
        })
    }
}



