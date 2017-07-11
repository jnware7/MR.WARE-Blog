var connectionString = process.env.CONNECTION_STRING
var pgp = require ('pg-promise')()
var db = pgp(connectionString)
require('dotenv').config()

var CREATE_POSTS =
`INSERT INTO posts(
title,
sub_title,
post
)
VALUES
($1,$2,$3)`

var READ_A_POSTS =
`SELECT * FROM posts ORDER BY post_time DESC LIMIT 1`

var READ_ALL_POSTS =
`SELECT * FROM posts LIMIT 2 `
 var READ_NEXT_POSTS =
`SELECT * FROM posts ORDER BY post_time ASC  LIMIT 2 OFFSET $1`
var READ_BY_ID=
`SELECT * FROM posts WHERE id=$1`
 var DELETE_POSTS =
`DELETE FROM posts WHERE id=$1`


 function readPosts(page = 1){
   var offSet = (page - 1) * 2
   return db.many(READ_NEXT_POSTS,[offSet])
 }
function createPosts(title,sub_title,post){
  return db.none(CREATE_POSTS,[title,sub_title,post])
};
function readAPosts(){
  return db.any(READ_A_POSTS,[])
};
function readAllPosts(){
  return db.any(READ_ALL_POSTS,[])
};
function readNextPosts(){
  return db.many(READ_NEXT_POSTS,[])
};
function deletePosts(id){
  return db.none(DELETE_POSTS,[id])
};
function readPostById(id){
  return db.one(READ_BY_ID,[id])
};


 module.exports = {
   createPosts,
   readAPosts,
   readAllPosts,
   readNextPosts,
   deletePosts ,
   readPosts,
   readPostById
}
