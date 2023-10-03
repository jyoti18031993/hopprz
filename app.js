const express = require("express");
const app = express();
const bodyparser=require("body-parser")
const dotenv = require("dotenv");
const connectDatabase = require("./src/config/connection");
const Router = require('./src/routes/index');
// app.use(bodyparser())

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config
dotenv.config({path:'config.env'})

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
})
app.use('/api/v1', Router);

app.get('/api', (req, res) => {
    res.status(200).json({ msg: 'OK' });
  });
