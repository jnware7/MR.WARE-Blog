var connectionString = 'http://localhost:5432/blogdb'
var pgp = require ('pg-promise')()
var db = pgp(connectionString)

//
var CREATE_USERS =
`INSERT INTO users(
user_name,
password
)`
var READ_A_USERS =
`SELECT * FROM users WHERE user_name =$1`
var READ_A_USERS_BY_NAME =
`SELECT * FROM users WHERE user_name = user_name`
// READ_ALL_USERS =
// `SELECT * FROM user `
// UPDATE_USERS =
// `UPDATE posts SET title,
// user_name =$1,
// password =$2,
// `
// DELETE USERS =
// `DELETE FROM user WHERE id=$1`



function createCustomer(user_name,password){
  return db.none(CREATE_USERS,[user_name,password])
};
function findAUsers(id){
  return db.one(READ_A_USERS,[id])
}
function findByUsersName(user_name){
  return db.one(READ_A_USERS_BY_NAME,[user_name])
}
module.exports = {
  createCustomer,
  findByUsersName,
  findAUsers
}
