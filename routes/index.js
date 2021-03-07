var express = require('express');
var router = express.Router();
const { response } = require('express');
var database = require('./database');
var formidable = require('formidable');
var bcrypt = require('bcrypt');

//requiring path and fs modules

const path = require('path');
const fs = require('fs');
const { verify } = require('crypto');
/* GET home page. */
router.get('/', async function(req, res, next) 
{
  text = `SELECT productname,description,price FROM products`;
  var rows = [];
  try{
    var {rows} = await database.query(text);
  }catch(error){
    console.log(error);
  }
  var id = rows[0].id ;
  rows.pic_url = '/product/' + id ;
  
  //get the pic form products to show it in the cards
  res.render('index', { title: 'bysell', products: rows});
});

router.post('/form', function (req, res, next) {

  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    console.log(fields);
    console.log(files,"picture should be here");

    // TODO validate input values before saving them to the database
    // TODO multipy currency values before saving them and divide them before you show them
    // 10.03 * 100 = 1003
    fields.price = fields.price * 100;

    const query = `insert into products(productname, description, price, city,
       category, user_id, created_at)
      VALUES ($1, $2, $3, $4, $5,$6, current_timestamp)`;

    try {
      await database.query(query, [
        fields.productname,
        fields.description,
        fields.price,
        fields.city,
        fields.category,
        req.session.user.id,
      ]);
    } catch(error) {
      console.log(error);
    }
    console.log('done');

    res.redirect('/profile')
  });
});

router.get('/form', function(req, res, next) {
  if(!req.session.user){
    res.redirect('/login');
  }
  
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
  console.log(password);
   const hashedPass = bcrypt.hashSync(password,10);
    query = `INSERT INTO users (name, email, password)
    VALUES('${name}', '${email}', '${hashedPass}')`;
    try{
        await database.query(query);
        console.log(hashedPass);
        result = await logIn(req.body);
        req.session.user = result;
        if (result) {
            res.redirect('/profile')
        }
    }
    catch(error){
        console.log(error);
    }

    res.redirect('/login');
    

   
});

router.get('/login', function(req, res, next){
  invalid = req.query.invalid;

  if(invalid) {
    var msg = "invalid email or password";
  }

  res.render('login', {pageName:'', msg: msg})
});

async function logIn(body){
  var email=body.email
  text = `SELECT name,id, password FROM users WHERE
   email = '${email}'`;
  rows =[];
  try{
    var {rows, rowCount} =  await database.query(text);
    if ( rowCount == 0 ){
        return null;
    }
    var verified = bcrypt.compareSync(body.password, rows[0]["password"]);
    console.log(verified);
  }catch(error){
    console.log(error);
  }
  if(verified){
    return rows[0];
  }
  else{
    return null;
  }
}

router.post('/login',async function(req, res, next){
  const check = req.body.check;
  result = await logIn(req.body);

  req.session.user = result;
  if (result){
    if (check) {
        res.cookie('user', req.session.user);
      }
  }
  else{
    res.redirect('/login?invalid=1');
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

router.get('/profile', async function(req, res, next){
  if(req.session.user){
    qqq = "SELECT productname,description,price FROM products WHERE user_id =" + req.session.user.id;
    rows = [];
    console.log(req.session.user.id);
    try{
      var {rows} = await database.query(qqq); 
      // TODO check if this works and understand it
      rows.price = rows.price / 100;
      console.log(rows);

    } catch(error){
      console.log(error);
    }
    console.log(rows[0]);

  }else{
    res.redirect('/login')
  }

  res.render('profile', {pageName:'profile',products:rows})
});

router.get('/product', function(req, res, next){
  res.render('product', {pageName:'',})
});
module.exports = router;