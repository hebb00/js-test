var express = require('express');
var router = express.Router();
var database = require('./database')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'bysell',cards: ''});
});

router.post('/form', async function(req, res, next) {

  console.log('parameters:', req.body);

  query = `INSERT INTO products (productname, description, category, price, picture, city)
            VALUES('${req.body.productname}', '${req.body.description}', '${req.body.category}', ${req.body.price}, 
            '${req.body.picture}', '${req.body.city}')`;

  try{
    console.log('work')
  await database.query(query);
  console.log('work2')

  }catch(error){
  console.log(error);
  }

  res.redirect('/');
});

router.get('/form', function(req, res, next) {
  
  res.render('form', { title: 'bysell',});
});

router.get('/product/:id', function(req, res, next){
  //id = req.params.id;

});

router.get('/signup', function (req, res, next) {
  res.render('signup', { pageName: 'signup' });
});

router.post('/signup', async function(req, res, next){
  const name = req.body.name;
  const email= req.body.email;
  const password= req.body.password;

  query = `INSERT INTO users (name, email, password)
    VALUES('${name}', '${email}', '${password}')`;
  try{
    await database.query(query);
  }catch(error){
    console.log(error);
  }
  res.redirect('/login')
});

router.get('/login', function(req, res, next){


  res.render('login', {pageName:'',})
});

router.post('/login',async function(req, res, next){

  const check = req.body.check;
  
  text = `SELECT name,id FROM users WHERE
   email = '${req.body.email}'AND password = '${req.body.password}'`;
  rows =[];
   try{
    var {rows, rowCount} = await database.query(text);
    if ( rowCount == 0 ){
      res.redirect('/login');
      return;
    }
   }catch(error){
    console.log(error);
   }
   console.log(rows);
   req.session.user = rows[0];
   console.log(req.session.user);

   if (check) {
    res.cookie('user', req.session.user);
  }

   res.redirect('/profile');
});

router.get('/logout', function(req, res, next){
 req.session.destroy (function(){
  console.log("user logged out.");
 });
 res.clearCookie('user');
 res.redirect('/login')

  res.render('logout', {pageName:'',})
});
router.get('/profile', function(req, res, next){


  res.render('profile', {pageName:'profile',})
});

module.exports = router;
