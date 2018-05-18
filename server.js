const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const OrderBook = require('./models/OrderBook');

passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ userName: username }, '+password', function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'Incorrect username.' });
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


/*----------------connect to the database---------------------------*/
mongoose.connect(process.env.MONGODB || process.env.MONGOLAB_URI || 'mongodb://admin:123456@ds245238.mlab.com:45238/btc');
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is available.');
  process.exit(1);
});


/*----------------setup server---------------------------*/
const app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'session secret key' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

/*-----------------------server rest-api-----------------------------------------*/
/**
 * Login a user
 */
app.post('/api/user/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) {
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/');
    });
  })(req, res, next);
});

app.post('/api/trading/order', function(req, res, next) {
  const user = req.user;
  if (!user) {
    return res.send(401, null);
  }
  const orderBook = new OrderBook({
    userId: user.id,
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
  const user = req.user;
  if (!user) {
    return res.send(401, null);
  }
  OrderBook.find({ userId: user.id }, function(err, orders) {
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

app.get('/', function(req, res) {
  const user = req.user;
  if (!user) {
    return res.render('login', {
      user: req.user
    });
  }
  res.render('index', {
    title: 'BTC Trading',
    user: req.user
  });
});

app.get('/login', function(req, res) {
  res.render('login', {
    user: req.user
  });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

/*---------------------start listening incoming requests---------------------*/
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});