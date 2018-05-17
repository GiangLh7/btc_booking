const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const OrderBook = require('./models/OrderBook');


/*----------------connect to the database---------------------------*/
mongoose.connect(process.env.MONGODB || process.env.MONGOLAB_URI || 'mongodb://admin:123456@ds245238.mlab.com:45238/btc');
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is available.');
  process.exit(1);
});


/*----------------setup server---------------------------*/
const app = express();
app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/*-----------------------server rest-api-----------------------------------------*/
/**
 * Login a user
 */
app.post('/api/user/login', function(req, res, next) {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    languages: req.body.languages
  });

  //check the existence of the email
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    //if the email already exists
    if (existingUser) {
      return res.send(409,{success: false, field: 'email', message: 'email already exists'});
    }

    //if not exist, then save the user
    user.save(function(err) {
      if (err) {
        return next(err);
      }
    });
  });
});

app.post('/api/trading/order', function(req, res, next) {
  const orderBook = new OrderBook({
    userId: "test",
    size: req.body.size,
    bid: req.body.bid
  });
  
  orderBook.save(function(err, order) {
    if (err) {
      return res.send(200, { success: false, message: err });
    }
    return res.send(200, { success: true, key: order.id });
  });
});

app.get('/api/trading/order', function(req, res, next) {
  OrderBook.find({ userId: "test" }, function(err, orders) {
    if (err) {
      next(err);
    }
    if (!orders || !orders.length) {
      return res.send(200, []);
    }
    return res.send(200, orders.map((o => ({
      key: o._id,
      size: o.size,
      bid: o.bid
    }))));
  });
});

/*---------------------start listening incoming requests---------------------*/
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});