require('dotenv').config();
const mysql = require('mysql2')

const connection = mysql.createPool( {
    host: "127.0.0.1",
    port: "3306",
    user: "my_user",
    password: "my_password",
    database: "my_database" 
});

connection.getConnection((err)=>{
    if(err)  console.log("===failed to connect===",err)

        console.log("all right")

})

module.exports = connection;