var express = require('express')
var app = express();
require('dotenv').config()
var port = process.env.PORT || 50962;
var bodyParser = require('body-parser')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var cookieSession = require('cookie-session')
var cookieParser = require('cookie-parser')
var dbpost = require('./src/db/posts')
var dbusers = require('./src/db/user')
var helmet = require('helmet');


var bcrypt = require('bcrypt')
var postRouter = express.Router();

app.use(express.static('public'));
app.set('views','./src/views');

var handlebars = require('express-handlebars')
app.engine('.hbs', handlebars({extname:'hbs'}));

app.set('view engine','.hbs');
app.use(bodyParser.urlencoded({extended:true}))

app.use(cookieParser())


  app.use(cookieSession({
  name: 'session',
  keys: [process.env.SECRET,process.env.SECRET2],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))



passport.use(new LocalStrategy(
  function(username, password, done){
    console.log('password==>', password)
    dbusers.findByUsersName(username).then(user =>{
      if(!user){
        return done(null,false,{message:'Incorrect username.'})
      }
      bcrypt.compare(password,user.password,(error,result)=>{
        console.log('result==>', result)
        if(error){ return done(err) }
        if(!result){
          return done(null,false)
        }
        return done(null,user)
    })
   })
 })
)


passport.serializeUser(function(user,done){
  console.log('entered serializeUser', user);
  done(null,user.user_name)
})

passport.deserializeUser(function(username,done){
  console.log('entered deserializeUser', username)
  dbusers.findByUsersName(username)
  .then(user =>{
    done(null,user)
  })
})

app.use(passport.initialize())
app.use(passport.session())

// app.route('/login')
//    .get(function(req,res){
//       res.render('login');
//     })
//     .post(passport.authenticate('local', {
//       successRedirect:'/home',
//       failureRedirect:'/login'
//     }))


// app.get('/home', function(req, res) {
//   res.send('this is the home page')
// })

app.get('/', function(req,res){
    dbpost.readAllPosts()
  .then((posts)=>{
    console.log(posts)
    res.render('index',{
      posts: posts,
      title:'MR. WARE',
      oneLiner:'A Blog On the Life Of Ware',
      nav: [{
        Link:'/Home',
        Text:'Home'
      },{
        Link:'/Contact',
        Text:'Contact'
      },{
        Link:'/Post',
        Text:'Post'
      },{
          Link:'/About',
          Text:'About'}]

   });
    }).catch((err) => {
      console.log('errored1',err);
  });
});
app.use(helmet());


app.get('/Home/:page*?', function(req,res){
  // *? allow for the route to work with or without a param in place
  console.log('you made it')

  var page = req.params.page || 1
    console.log('page==>',page)
  dbpost.readPosts(page)
  .then((posts)=>{
    // console.log(page)
    res.render('index',{
      posts: posts,
      title:'MR. WARE',
      oneLiner:'A Blog On the Life Of Ware',
      page: page,
      nextpage: Number(page) + 1,
      nav: [{
        Link:'/Home',
        Text:'Home'
      },{
        Link:'/Contact',
        Text:'Contact'
      },{
        Link:'/Post',
        Text:'Post'
      },{
          Link:'/About',
          Text:'About'}]

   });
    }).catch((err) => {
      console.log('errored1',err);
  });
});


  app.get('/Contact', function(req,res){
      res.render('contact',{
        title:'MR. WARE',
        oneLiner:'A Blog On the Life Of Ware',
        nav: [{
          Link:'/Home',
          Text:'Home'
        },{
          Link:'/Contact',
          Text:'Contact'
        },{
          Link:'/Post',
          Text:'Post'
        },{
            Link:'/About',
            Text:'About'}]
     });
    });
postRouter.route('/')
    .get( function(req,res){
      dbpost.readAPosts()
        .then((posts)=>{

        res.render('main_post',{
          post: posts[0],
          title:'MR. WARE',
          oneLiner:'A Blog On the Life Of Ware',
          nav: [{
            Link:'/Home',
            Text:'Home'
          },{
            Link:'/Contact',
            Text:'Contact'
          },{
            Link:'/Post',
            Text:'Post'
          },{
              Link:'/About',
              Text:'About'
            },{
              Link:'/Post/login',
              Text:'Login'}]
       })
     }).catch((err) => {
         console.log('errored');
    });
  });





     postRouter.route('/postform')
     .get( function(req,res){
         res.render('form');
      })


postRouter.route('/login')
 .get(function(req,res){
    res.render('login');
  })
  .post(passport.authenticate('local', {
    successRedirect:'/post/postform',
    failureRedirect:'/post'
  }))

    // function(req, res) {
    //   console.log('here bitch =======>');
    //   res.status(301).redirect('/post/postform')
    // })

    postRouter.route('/:id')
        .get( function(req,res){
          var id = req.params.id
          dbpost.readPostById(id)
          .then((post)=>{
console.log('post',post)
            res.render('main_post',{

              title:'MR. WARE',
              oneLiner:'A Blog On the Life Of Ware',
              nav: [{
                Link:'/Home',
                Text:'Home'
              },{
                Link:'/Contact',
                Text:'Contact'
              },{
                Link:'/Post',
                Text:'Post'
              },{
                  Link:'/About',
                  Text:'About'
                }],
                post:post
           })})
          })
          // var id = req.params.id
          // dbpost.readAPosts(id)
          //   .then(post=>
            // res.render

      //    }).catch((err) => {
      //        console.log('errored');
      //   });
      // });

app.use('/post', postRouter)

//             function(req, res) {
//       var user_name = req.body.user_name
//       var password = req.body.password
//           console.log('processing');
//           res.redirect('/post/postform');
//
//
//
// })
app.get('/About', function(req,res){

    res.render('about',{
      title:'MR. WARE',
      oneLiner:'A Blog On the Life Of Ware',
      nav: [{
        Link:'/Home',
        Text:'Home'
      },{
        Link:'/Contact',
        Text:'Contact'
      },{
        Link:'/Post',
        Text:'Post'
      },{
          Link:'/About',
          Text:'About'}]
   });
  });




var sessionChecker = function(req,res,next){
  if(!(req.session.passport && req.cookies.user_id)){
    res.clearCookie('user_sid')
  }
  next()
}

app.use(sessionChecker)

postRouter.route('/newpost')
  .post((request, response) => {
    var title = request.body.title
    var sub_title  = request.body.sub_title
    var post = request.body.post
    console.log(title)
    console.log(sub_title)
    console.log(post)

    dbpost.createPosts(title,sub_title,post)
    .then((post)=>{
      response.redirect('/post')
    }).catch(error =>{
    response.json({
      messsage: error.message,
      error: error
    })
  })

  })




app.listen(port, function(err){
  console.log(`running server on port:${port}`);
});
