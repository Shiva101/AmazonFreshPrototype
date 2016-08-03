
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , index = require('./routes/index')
  , home = require('./routes/home')
  , login = require('./routes/login')
  , user = require('./routes/user')
  , billing = require('./routes/billing')
  , customer = require('./routes/customer')
  , order = require('./routes/order')
  , trips = require('./routes/trips')
  , sessionMgmt = require('./routes/sessionMgmt')
  , farmer = require('./routes/farmer')
  , admin = require('./routes/admin') 
  , product = require('./routes/product');

//URL for the sessions collections in mongoDB
var mongoSessionConnectURL = "mongodb://localhost:27017/Amazonfresh";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/mongo");

var app = express();

app.use(expressSession({
	secret: 'cmpe273_teststring',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


//GET
// Customer Module
app.get('/', routes.index); 
app.get('/signin',index.signIn);
app.get('/signup', index.signUp);
app.get('/homepage', login.redirectToHomepage);
app.get('/logout', login.logout);
app.get('/showProduct/:productId', product.showProductDescription);
app.get('/shoppingCart', order.showShoppingCart);
app.get('/checkout', order.checkout);
app.get('/makePayment', order.makePayment);
app.get('/viewPurchaseHistory', order.viewPurchaseHistory);
app.post('/checkLogin', login.checkLogin);
app.post('/register', user.register);
app.post('/listAllProducts', product.listAllProduct);
app.post('/addToCart', order.addToCart);
app.post('/getShoppingCart', order.getShoppingCart);
app.post('/removeItemFromCart', order.removeItemFromCart);
app.post('/placeOrder', order.placeOrder);
app.post('/getExistingAddress', customer.getExistingAddress);
app.post('/getAllOrders', order.getAllOrders);
app.post('/getAllOrdersByCustId', order.getAllOrdersByCustId);


//Farmer module
app.get('/farmerDashboard', farmer.farmerDashboard);
app.get('/addProduct', farmer.addProduct);
app.get('/loadProducts', farmer.loadProducts);
app.post('/renderAddProduct', farmer.renderAddProduct);
app.post('/submitAddProduct', farmer.submitAddProduct);

//Admin module
app.get('/admin', index.adminSignIn);
app.post('/adminLogin', index.checkAdminLogin);
app.get('/adminDashboard', index.adminDashboard);
app.get('/adminGetFarmerList', admin.adminGetFarmerList);
app.get('/adminGetFarmerApprovalPendingList', admin.adminGetFarmerApprovalPendingList);
app.get('/adminApproveFarmer', admin.adminApproveFarmer);
app.get('/adminDisapproveFarmer', admin.adminDisapproveFarmer);
app.get('/adminGetFarmerSearchList', admin.adminGetFarmerSearchList);
app.get('/adminGetCustomerList', admin.adminGetCustomerList);
app.get('/adminGetCustomerApprovalPendingList', admin.adminGetCustomerApprovalPendingList);
app.get('/adminApproveCustomer', admin.adminApproveCustomer);
app.get('/adminDisapproveCustomer', admin.adminDisapproveCustomer);
app.get('/adminGetCustomerSearchList', admin.adminGetCustomerSearchList);
app.get('/adminGetProductList', admin.adminGetProductList);
app.get('/adminGetProductApprovalPendingList', admin.adminGetProductApprovalPendingList);
app.get('/adminApproveProduct', admin.adminApproveProduct);
app.get('/adminDisapproveProduct', admin.adminDisapproveProduct);
app.get('/adminGetProductSearchList', admin.adminGetProductSearchList);
app.get('/adminGetBillingList', admin.adminGetBillingList);
app.get('/adminGetBillingSearchList', admin.adminGetBillingSearchList);


app.get('/adminGetUniqueProductTypes', admin.adminGetUniqueProductTypes);
app.get('/adminGetUniqueProducts', admin.adminGetUniqueProducts);
app.get('/adminApplyDPForProductType', admin.adminApplyDPForProductType);
app.get('/adminApplyDPForProduct', admin.adminApplyDPForProduct);


app.get('/adminGetRevenuePerWeek', admin.adminGetRevenuePerWeek);
app.get('/adminGetRidesPerArea', admin.adminGetRidesPerArea);


app.use(function(req, res, next) {
	res.render('error');
});


//connect to the mongo collection session and then createServer
mongo.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
});