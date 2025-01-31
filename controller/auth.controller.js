const { resolve } = require('path');
// const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const sql = require("../config/db.config");

// exports.signUp =  async (req, res) => {
//     if (!req.body || !req.body.email || !req.body.password) {
//         return res.status(400).send({
//             message: "Content cannot be empty"
//         });
//     } 

// }



console.log("====abc1===")
exports.signUp = async (req, res) => {
console.log("====abc2===")
    
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            ErrorCode: 204,
            Message: 'Email and password cannot be empty'
        });
    }
    console.log("====abc3===")

    const { role_id, username, email, password, profilepicture } = req.body;

    const insertQuery =  'INSERT INTO users (role_id, username, email, password, profilepicture ) VALUES (?,?,?,?,?)';



    sql.query(insertQuery, [role_id, username, email, password, profilepicture], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ErrorCode: 500,
                Message: 'An error occurred while creating the user.',
            });
        }

      
        res.status(201).json({
            message: 'User created successfully',
            data:{
                userId: result.insertId
            }
        });
    });
};

exports.signIn = async(req, res) => {

    if(!req.body.email || !req.body.password){
        return res.status(400).json({
            message:' content cannot be empty'
        });
    }
     const {email, password} = req.body;

     const selectQuery = 'SELECT id, email, password, role_id, username, profilepicture FROM users WHERE email = ?';

     sql.query(selectQuery, [email], (err, result) =>{
        if (err) {
            console.log('error:', err);
            return res.status(400).json({
            message:' content cannot be empty'

        })
    }

    const user = result[0];
    if (password !== user.password){
        return res.status(401).json({
            ErrorCode: 401,
            Message: 'Invalid credentials.'
        });
    } 
    res.status(200).json({
        message: 'User signed in successfully.',
        data: {
            user_id: user.id,
            email: user.email,
            username: user.username,
            role_id: user.role_id,
            profile_picture: user.profilepicture
        }
    });
     })
}
