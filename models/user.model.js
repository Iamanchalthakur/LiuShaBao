// const bcrypt = require('bcrypt');
// const sql = require("../config/db.config");

// const User = function (user) {
//     this.rol_id = user.role_id;
//     this.email = user.email;
//     this.password = user.password;
// };

// User.create = (newUser, result) => {
//     sql.query("INSERT INTO users SET ? ", newUser, (err, res) => {
//         if (err) {
//             console.log("error:", err);
//             result(err,null);
//             return;
//         }

//         console.log("user created:", {id: res.insertId, ...newUser});
//         delete newUser['password'];
//         result(null, {id: res.insertId, ...newUser});
//     });
// };