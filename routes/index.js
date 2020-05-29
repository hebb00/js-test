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

router.get('/form', async function(req, res, next) {
  // text = `SELECT FROM * products`;
  // rows = [];
  // try{
  //   const rows = await database.query(text);
  // }catch(error){
  //   console.log(error);
  // }
  // console.log(rows)
  //get the pic form products to show it in the cards
  res.render('form', { title: 'bysell',cards: ''});
});

module.exports = router;
