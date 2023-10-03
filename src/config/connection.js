const {Pool}=require('pg');
const database=new Pool({
    host:'localhost',
    user:'postgres',
    password:'123456',
    database:'Hopprz'
})
database.connect((err)=>{
    if(err) throw err;
    console.log("database connected successfully");

});
module.exports=database;