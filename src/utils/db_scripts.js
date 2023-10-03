const db_sql = {

  //Query for users
  "Q1": `select * from users where email = '{var1}'`,
  "Q2": `INSERT INTO users(name,email,password,contactNumber,profilepicture,otp) 
              VALUES('{var1}','{var2}','{var3}','{var4}','{var5}','{var6}') RETURNING *`,
  "Q3": `update users set otp='{var1}',updated_at='{var2}' where email= '{var3}' RETURNING *`,
  "Q4": `update users set is_verified='{var1}',otp='{var2}',updated_at='{var3}' where email= '{var4}' RETURNING *`,
  "Q5": `select * from users where users_id = '{var1}'`,
  "Q6": `update users set password='{var1}',updated_at='{var2}' where users_id= '{var3}' RETURNING *`,
  "Q7": `update users set password='{var1}',otp='{var2}',updated_at='{var3}' where email= '{var4}' RETURNING *`,
  "Q8": `update users set is_deleted='{var1}',deleted_at='{var2}' where users_id= '{var3}' RETURNING *`,
  "Q9": `update users set name='{var1}',contactNumber='{var2}',updated_at='{var3}' where users_id= '{var4}' RETURNING *`,

  //Query for login sassion management for user
  "Q10": `insert INTO sessionmanagement (users_id,login_at,sessionstatus,token,devicename,ip_address)VALUES('{var1}','{var2}','{var3}','{var4}','{var5}','{var6}') RETURNING * `,

  //Query for login sassion management for admin 
  "Q19": `insert INTO sessionOfAdmin (admins_id,login_at,sessionstatus,token,devicename,ip_address)VALUES('{var1}','{var2}','{var3}','{var4}','{var5}','{var6}') RETURNING * `,

  //Queries for category and sub category
  "Q11": `insert into categories (name,iconname,description,created_by) values('{var1}','{var2}','{var3}','{var4}') RETURNING *`,
  "Q12": `SELECT * FROM categories WHERE name = '{var1}'`,
  "Q13": `SELECT * FROM categories WHERE id = '{var1}'`,
  "Q14": `insert into categories (name,iconname,description,parent_id,created_by) values('{var1}','{var2}','{var3}','{var4}','{var5}') RETURNING *`,
  "Q15": `SELECT * FROM categories WHERE parent_id = '{var1}'`,
  "Q16": `SELECT * FROM categories WHERE parent_id is null`,
  "Q21": `update categories set is_deleted='{var1}',deleted_at='{var2}',deleted_by='{var3}' where name='{var4}' RETURNING *`,
  "Q22": ``,
  //queries for admin
  "Q17": `select * from admins where email = '{var1}'`,
  "Q18": `INSERT INTO admins(name,email,password,contactNumber,profilepicture) 
  VALUES('{var1}','{var2}','{var3}','{var4}','{var5}') RETURNING *`,
  "Q20": `select * from admins where admins_id = '{var1}'`,

}

function dbScript(template, variables) {
  if (variables != null && Object.keys(variables).length > 0) {
    template = template.replace(new RegExp("\{([^\{]+)\}", "g"), (_unused, varName) => {
      return variables[varName];
    });
  }
  template = template.replace(/'null'/g, null);
  return template
}

module.exports = { db_sql, dbScript };