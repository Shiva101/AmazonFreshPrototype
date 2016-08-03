var mysql = require('./mysql');
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/Amazonfresh";

//// *******    start admin Farmer module  ******** /////

exports.handle_request_getFarmerList = function (msg, callback){
	
	var res = {};
	var limit = 250;
	var offset = msg.startPosition;
	console.log("In handle_request_adminGetFarmerList:"+ msg.username);
	var username = msg.username;

	//var farmerList = "SELECT * FROM f LIMIT " + offset + "," + limit + ";";
	var farmerList = "SELECT far_id, farmer_id, first_name, last_name, city, state, zipcode, email, contact  FROM farmers LIMIT " + offset + "," + limit + ";";
	console.log("Query is:"+farmerList);

	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				res.farmerList = jsonParse;
				res.count = results.length;
				res.Status = 200;
				console.log("Rabbit Backend: farmerList  count:"+ results.length );
				//res.send(resInfo);
			}
			else {    
				console.log("No farmers found in database");
			}
			callback(null, res);
		}  
	},farmerList);
}; 	// end handle_request_getFarmerList

exports.handle_request_getFarmerApprovalPendingList = function (msg, callback){
	var res = {};
	var limit = 250;
	var offset = msg.startPosition;
	console.log("In handle_request_adminGetFarmerList:");
	var farmerList = "SELECT far_id, farmer_id, first_name, last_name, city, state, zipcode, email, contact  FROM farmers where approved = 0 LIMIT " + offset + "," + limit + ";";
	console.log("Query is:"+farmerList);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				res.farmerList = jsonParse;
				res.count = results.length;
				res.Status = 200;
				console.log("Rabbit Backend: pending farmerList  count:"+ results.length );
				//res.send(resInfo);
			}
			else {    
				res.message = "No pending farmers found in database";
				console.log("No pending farmers found in database");
			}
			callback(null, res);
		}  
	},farmerList);
}; 	// end handle_request_getFarmerApprovalPendingList

exports.handle_request_approveFarmer = function (msg, callback){
	var res = {};
	console.log("In handle_request_approveFarmer:");
	var farmerID = msg.farmer;
	var query = "UPDATE farmers SET approved = 1 WHERE far_id = " + farmerID + ";";
	console.log("Query is:"+ query);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.Status = 202;
			res.Message = "Farmer request is approved";
			console.log("Farmer request is approved");
			callback(null, res);
		}  
	},query);
}; 	// end handle_request_approveFarmer

exports.handle_request_disApproveFarmer = function (msg, callback){
	var res = {};
	console.log("In handle_request_disApproveFarmer:");
	var farmerID = msg.farmer;
	var query = "UPDATE farmers SET approved = 0 WHERE far_id = " + farmerID + ";";
	console.log("Query is:"+ query);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.Status = 202;
			res.Message = "Farmer request is rejected";
			console.log("Farmer request is rejected");
			callback(null, res);
		}  
	},query);
}; 	// end handle_request_disApproveFarmer

exports.handle_request_getFarmerSearchList = function (msg, callback){
	var res = {};
	var limit = 250;
	var offset = msg.startPosition;
	var searchCriteria = msg.searchCriteria;
	var q = msg.q;
	var farmerList;
	console.log("In handle_request_getFarmerSearchList: "+ searchCriteria + ":"+q);
	switch (searchCriteria){
		case"firstname":
			farmerList = "SELECT far_id, farmer_id, first_name, last_name, city, state, zipcode, email, contact  FROM farmers where first_name =" + '"' + q +'"' +" LIMIT " + offset + "," + limit + ";";
		break;
		case "lastname":
			farmerList = "SELECT far_id, farmer_id, first_name, last_name, city, state, zipcode, email, contact  FROM farmers where last_name =" + '"' + q +'"' +" LIMIT " + offset + "," + limit + ";";
		break;
		case "farmerID":
			farmerList = "SELECT far_id, farmer_id, first_name, last_name, city, state, zipcode, email, contact  FROM farmers where farmer_id =" + '"' + q +'"' +" LIMIT " + offset + "," + limit + ";";
		break;
		case "contact" :
			farmerList = "SELECT far_id, farmer_id, first_name, last_name, city, state, zipcode, email, contact  FROM farmers where contact =" + '"' + q +'"' +" LIMIT " + offset + "," + limit + ";";
		break;
		case "email":
			farmerList = "SELECT far_id, farmer_id, first_name, last_name, city, state, zipcode, email, contact  FROM farmers where email =" + '"' + q +'"' +" LIMIT " + offset + "," + limit + ";";
		break;
		case "city":
			farmerList = "SELECT far_id, farmer_id, first_name, last_name, city, state, zipcode, email, contact  FROM farmers where city =" + '"' + q +'"' +" LIMIT " + offset + "," + limit + ";";
		break;
		case "state":
			farmerList = "SELECT far_id, farmer_id, first_name, last_name, city, state, zipcode, email, contact  FROM farmers where state =" + '"' + q +'"' +" LIMIT " + offset + "," + limit + ";";
		break;
		case "zipcode":
			farmerList = "SELECT far_id, farmer_id, first_name, last_name, city, state, zipcode, email, contact  FROM farmers where zipcode =" + '"' + q +'"' +" LIMIT " + offset + "," + limit + ";";
		break;
		default:
			farmerList = "SELECT far_id, farmer_id, first_name, last_name, city, state, zipcode, email, contact  FROM farmers where farmer_id like '%"+q+"%' or first_name like '%"+q+"%' or last_name like '%"+q+"%' or address like '%"+q+"%' or city like '%"+q+"%' or state like '%"+q+"%' or zipcode like '%"+q+"%' or email like '%"+q+"%' or contact like '%"+q+"%' LIMIT " + offset + "," + limit + ";";
	}
	
	console.log("Query is:"+farmerList);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				res.farmerList = jsonParse;
				res.count = results.length;
				res.Status = 200;
				console.log("Rabbit Backend: search farmerList  count:"+ results.length );
			}
			else {    
				res.message = "End of search result";
				console.log("End of search result");
			}
			callback(null, res);
		}  
	},farmerList);
}; 	// end handle_request_getFarmerSearchList

//// *******    End admin Farmer module  ******** /////

//////////// **************    Start admin Customer module  ******************* ////////////////////
exports.handle_request_getCustomerList = function (msg, callback){
	var res = {};
	var limit = 900;
	var offset = msg.startPosition;
	console.log("In handle_request_adminGetCustomerList:"+ msg.username);
	var username = msg.username;
	var customerList = "SELECT cust_id, customer_id, first_name, last_name, city, state, zipcode, email  FROM customers LIMIT " + offset + "," + limit + ";";
	console.log("Query is:"+ customerList);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				res.customerList = jsonParse;
				res.count = results.length;
				res.Status = 200;
				console.log("Rabbit Backend: customerList  count:"+ results.length );
				//res.send(resInfo);
			}
			else {    
				console.log("No customer found in database");
			}
			callback(null, res);
		}  
	},customerList);
}; 	// end handle_request_getCustomerList

exports.handle_request_getCustomerApprovalPendingList = function (msg, callback){
	var res = {};
	var limit = 250;
	var offset = msg.startPosition;
	console.log("In handle_request_adminGetCustomerList:");
	var customerList = "SELECT cust_id, customer_id, first_name, last_name, city, state, zipcode, email  FROM customers where approved = 0 LIMIT " + offset + "," + limit + ";";
	console.log("Query is:"+ customerList);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				res.customerList = jsonParse;
				res.count = results.length;
				res.Status = 200;
				console.log("Rabbit Backend: pending customerList  count:"+ results.length );
				//res.send(resInfo);
			}
			else {    
				res.message = "No pending customers found in database";
				console.log("No pending customers found in database");
			}
			callback(null, res);
		}  
	},customerList);
}; 	// end handle_request_getCustomerApprovalPendingList

exports.handle_request_approveCustomer = function (msg, callback){
	var res = {};
	console.log("In handle_request_approveCustomer:");
	var customerID = msg.customer;
	var query = "UPDATE customers SET approved = 1 WHERE cust_id = " + customerID + ";";
	console.log("Query is:"+ query);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			console.log("Customer request is approved");
			res.Status = 202;
			res.Message = "Customer request is approved";
			console.log("Customer request is approved");
			callback(null, res);
		}  
	},query);
}; 	// end handle_request_approveCustomer

exports.handle_request_disApproveCustomer = function (msg, callback){
	var res = {};
	console.log("In handle_request_disApproveCustomer:");
	var customerID = msg.customer;
	var query = "UPDATE customers SET approved = 0 WHERE cust_id = " + customerID + ";";
	console.log("Query is:"+ query);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.Status = 202;
			res.Message = "Customer request is rejected";
			console.log("Customer request is rejected");
			callback(null, res);
		}  
	},query);
}; 	// end handle_request_disApproveCustomer

exports.handle_request_getCustomerSearchList = function (msg, callback){
	var res = {};
	var limit = 250;
	var offset = msg.startPosition;
	var searchCriteria = msg.searchCriteria;
	var q = msg.q;
	var customerList;
	console.log("In handle_request_getCustomerSearchList: "+ searchCriteria + ":"+q);
	switch (searchCriteria){
		case"firstname":
			customerList = "SELECT cust_id, customer_id, first_name, last_name, city, state, zipcode, email  FROM customers where first_name =" + '"' + q +'"' +" LIMIT " + offset + "," + limit + ";";
		break;
		case "lastname":
			customerList = "SELECT cust_id, customer_id, first_name, last_name, city, state, zipcode, email  FROM customers where last_name =" + '"' + q +'"' +" LIMIT " + offset + "," + limit + ";";
		break;
		case "farmerID":
			customerList = "SELECT cust_id, customer_id, first_name, last_name, city, state, zipcode, email  FROM customers where customer_id =" + '"' + q +'"' +" LIMIT " + offset + "," + limit + ";";
		break;
		case "contact" :
			customerList = "SELECT cust_id, customer_id, first_name, last_name, city, state, zipcode, email  FROM customers where contact =" + '"' + q +'"' +" LIMIT " + offset + "," + limit + ";";
		break;
		case "email":
			customerList = "SELECT cust_id, customer_id, first_name, last_name, city, state, zipcode, email  FROM customers where email =" + '"' + q +'"' +" LIMIT " + offset + "," + limit + ";";
		break;
		case "city":
			customerList = "SELECT cust_id, customer_id, first_name, last_name, city, state, zipcode, email  FROM customers where city =" + '"' + q +'"' +" LIMIT " + offset + "," + limit + ";";
		break;
		case "state":
			customerList = "SELECT cust_id, customer_id, first_name, last_name, city, state, zipcode, email  FROM customers where state =" + '"' + q +'"' +" LIMIT " + offset + "," + limit + ";";
		break;
		case "zipcode":
			customerList = "SELECT cust_id, customer_id, first_name, last_name, city, state, zipcode, email  FROM customers where zipcode =" + '"' + q +'"' +" LIMIT " + offset + "," + limit + ";";
		break;
		default:
			customerList = "SELECT cust_id, customer_id, first_name, last_name, city, state, zipcode, email  FROM customers where customer_id like '%"+q+"%' or first_name like '%"+q+"%' or last_name like '%"+q+"%' or address like '%"+q+"%' or city like '%"+q+"%' or state like '%"+q+"%' or zipcode like '%"+q+"%' or email like '%"+q+"%' or contact like '%"+q+"%' LIMIT " + offset + "," + limit + ";";
	}
	
	console.log("Query is:"+ customerList);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				res.customerList = jsonParse;
				res.count = results.length;
				res.Status = 200;
				console.log("Rabbit Backend: search customerList  count:"+ results.length );
			}
			else {    
				res.message = "End of search result";
				console.log("End of search result");
			}
			callback(null, res);
		}  
	}, customerList);
}; 	// end handle_request_getCustomerSearchList
//////////// **************    end  admin Customer module  ******************* ////////////////////

//////////// **************    Start admin Product module  ******************* ////////////////////
exports.handle_request_getProductList = function (msg, callback){
	var res = {};
	var limit = 950;
	var offset = msg.startPosition;
	console.log("In handle_request_getProductList:");
	//var username = msg.username;
	var productList = "SELECT product_id, farmer_id, name, price, quantity, product_type, description FROM product LIMIT " + offset + "," + limit + ";";
	console.log("Query is:"+ productList);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				res.productList = jsonParse;
				res.count = results.length;
				res.Status = 200;
				console.log("Rabbit Backend: productList  count:"+ results.length );
				//res.send(resInfo);
			}
			else {    
				console.log("No product found in database");
			}
			callback(null, res);
		}  
	},productList);
}; 	// end handle_request_getProductList

exports.handle_request_getProductApprovalPendingList = function (msg, callback){
	var res = {};
	var limit = 250;
	var offset = msg.startPosition;
	console.log("In handle_request_getProductApprovalPendingList:");
	var productList = "SELECT product_id, farmer_id, name, price, quantity, product_type, description FROM product where approved " + "=0" + " LIMIT " + offset + "," + limit + ";";
	//var productList = "SELECT cust_id, customer_id, first_name, last_name, city, state, zipcode, email  FROM customers where approved = 0 LIMIT " + offset + "," + limit + ";";
	console.log("Query is:"+ productList);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				res.productList = jsonParse;
				res.count = results.length;
				res.Status = 200;
				console.log("Rabbit Backend: pending productList  count:"+ results.length );
				//res.send(resInfo);
			}
			else {    
				res.message = "No pending product found in database";
				console.log("No pending product found in database");
			}
			callback(null, res);
		}  
	},productList);
}; 	// end handle_request_getProductApprovalPendingList

exports.handle_request_approveProduct = function (msg, callback){
	var res = {};
	console.log("In handle_request_approveProduct:");
	var productID = msg.product;
	var query = "UPDATE product SET approved = 1 WHERE product_id = " + productID + ";";
	console.log("Query is:"+ query);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			console.log("Product request is approved");
			res.Status = 202;
			res.Message = "Product request is approved";
			console.log("Productr request is approved");
			callback(null, res);
		}  
	},query);
}; 	// end handle_request_approveProduct

exports.handle_request_disApproveProduct = function (msg, callback){
	var res = {};
	console.log("In handle_request_disApproveProduct:");
	var productID = msg.product;
	var query = "UPDATE product SET approved = 0 WHERE product_id = " + productID + ";";
	console.log("Query is:"+ query);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			res.Status = 202;
			res.Message = "Product request is rejected";
			console.log("Product request is rejected");
			callback(null, res);
		}  
	},query);
}; 	// end handle_request_disApproveProduct

exports.handle_request_getProductSearchList = function (msg, callback){
	var res = {};
	var limit = 250;
	var offset = msg.startPosition;
	var searchCriteria = msg.searchCriteria;
	var q = msg.q;
	var productList;
	console.log("In handle_request_getProductSearchList: "+ searchCriteria + ":"+q);
	switch (searchCriteria){
		case"product_id":
			productList = "SELECT product_id, farmer_id, name, price, quantity, product_type FROM product where product_id =" + '"' + q +'"' +"  LIMIT " + offset + "," + limit + ";";

		break;
		case "famrer_id":
			productList = "SELECT cust_id, customer_id, first_name, last_name, city, state, zipcode, email  FROM customers where last_name =" + '"' + q +'"' +" LIMIT " + offset + "," + limit + ";";
		break;
		case "name":
			productList = "SELECT cust_id, customer_id, first_name, last_name, city, state, zipcode, email  FROM customers where customer_id =" + '"' + q +'"' +" LIMIT " + offset + "," + limit + ";";
		break;
		case "product_type" :
			productList = "SELECT cust_id, customer_id, first_name, last_name, city, state, zipcode, email  FROM customers where contact =" + '"' + q +'"' +" LIMIT " + offset + "," + limit + ";";
		break;
		default:
			productList = "SELECT cust_id, customer_id, first_name, last_name, city, state, zipcode, email  FROM customers where customer_id like '%"+q+"%' or first_name like '%"+q+"%' or last_name like '%"+q+"%' or address like '%"+q+"%' or city like '%"+q+"%' or state like '%"+q+"%' or zipcode like '%"+q+"%' or email like '%"+q+"%' or contact like '%"+q+"%' LIMIT " + offset + "," + limit + ";";
	}
	
	console.log("Query is:"+ productList);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				res.productList = jsonParse;
				res.count = results.length;
				res.Status = 200;
				console.log("Rabbit Backend: search productList  count:"+ results.length );
			}
			else {    
				res.message = "End of search result";
				console.log("End of search result");
			}
			callback(null, res);
		}  
	}, productList);
}; 	// end handle_request_getProductSearchList
//////////// **************    end  admin Product module  ******************* ////////////////////


//// *******    start admin Billing module  ******** /////
exports.handle_request_getBillingList = function (msg, callback){	
	var res = {};
	var limit = 250;
	var offset = msg.startPosition;
	console.log("In handle_request_adminGetFarmerList:");
    res.Status  = 200;
    res.Message = "test Billing";
    callback(null, res);
	/*
	//var farmerList = "SELECT * FROM f LIMIT " + offset + "," + limit + ";";
	var farmerList = "SELECT frm_id, farmer_id, first_name, last_name, city, state, zipcode, email, contact  FROM farmers LIMIT " + offset + "," + limit + ";";
	console.log("Query is:"+farmerList);

	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				res.farmerList = jsonParse;
				res.count = results.length;
				res.Status = 200;
				console.log("Rabbit Backend: farmerList  count:"+ results.length );
				//res.send(resInfo);
			}
			else {    
				console.log("No farmers found in database");
			}
			callback(null, res);
		}  
	},farmerList); */

}; 	// end handle_request_getFarmerList


exports.handle_request_getBillingSearchList = function (msg, callback){
	
	var res = {};
	var limit = 250;
	var offset = msg.startPosition;
	console.log("In handle_request_getBillingSearchList:");
    res.Status  = 200;
    res.Message = "test Billing search";
    callback(null, res);

};
//// *******    end admin Billing module  ******** /////

//// *******    Start  admin Stats  module  ******** /////

exports.handle_request_getRevenuePerWeek = function (msg, callback){
	var res = {};
	console.log("In handle_request_getRevenuePerWeek:");
	var date = msg.date;
	var totalRevenueOnTheDay = 0;
	console.log(msg.date);
	var revenueJson = {};
    var revenueDate = new Date(msg.date); 
    revenueDate.setDate(revenueDate.getDate()+1);
    console.log("Revenue Date"+revenueDate.getDate()+"-"+(revenueDate.getMonth()+1)+"-"+revenueDate.getFullYear());
    var dateOneAfter = new Date(revenueDate);
    dateOneAfter.setDate(dateOneAfter.getDate() + 1);
    var dateTwoAfter = new Date(dateOneAfter); 
    dateTwoAfter.setDate(dateTwoAfter.getDate() + 1);
    console.log("Date: " + revenueDate);
    console.log("Date One After: " + dateOneAfter);
    console.log("Date Two After: " + dateTwoAfter);

	var dateConvert = function(date){
		console.log("Convert Date Called!");
		var mm = date.getMonth()+1;
		console.log(mm);
		var dd = "";
		if(date.getDate() < 10)  
			{
				dd = "0"+date.getDate();
			}
		if(mm<10) 
			{
				mm = "0" + mm;
			}
		var yyyy = date.getFullYear();

		return [yyyy,mm,dd].join("-");
	}   

    console.log("revenueDate: "+dateConvert(revenueDate));
    console.log("dateOneAfter: "+dateConvert(dateOneAfter));
    console.log("dateTwoAfter"+dateConvert(dateTwoAfter));
      mongo.connect(mongoURL, function () {
        var coll = mongo.collection('orders');        
        coll.find({"delivery_date": "05/03/2016"}).toArray(function (err, results) {
            if(results.length > 0){
	            for (var i = 0; i < results.length; i++) {
	            	totalRevenueOnTheDay += results[i].amount;
	            	revenueJson.Status=200;
	            	revenueJson.totalRevenueOnTheDay = totalRevenueOnTheDay;
        		}
        		console.log("success"+totalRevenueOnTheDay);
	            }
	            callback(null, revenueJson);
        	});

    });
}; 	// end handle_request_getRevenuePerWeek

exports.handle_request_getRidesPerArea = function (msg, callback){
	console.log("In handle_request_getRidesPerArea:");
	var states = msg.states;
	console.log ("1 = " +states[1]);
	var count = msg.count;
	var i = 0;
	console.log(count);
	var ridesJson = {};   
	console.log("States: " +states);
	var rideCount=[];
	for (i=0; i<count; i++){
		rideCount[i] = Math.floor((Math.random ()*20) + 1)
	}
	ridesJson.rideCount= rideCount;
	ridesJson.Status = 200;
	console.log(JSON.stringify(ridesJson));
	callback(null, ridesJson);
      /*mongo.connect(mongoURL, function () {
        var coll = mongo.collection('orders');        
        for (i = 0; i < count ; i++){
        coll.find({"customer_state": states[i]}).toArray(function (err, results) {
            if(results.length > 0){
        		console.log("success"+results.length);
        		ridesJson.rideCount[i] = results.length;
        		ridesJson.Status=200;
	            }
        	});
    	}callback(null, ridesJson);
    }); */

}; 	// end handle_request_getRevenuePerWeek
//// *******    End  admin Stats  module  ******** /////
//// *******    Start admin Dynamic Pricing module  ******** /////

exports.handle_request_getUniqueProductTypes = function (msg, callback){
	var res = {};
	console.log("In handle_request_getUniqueProductTypes:");

	var query = "SELECT DISTINCT product_type FROM product";
	console.log("Query is:"+ query);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				res.productTypes = jsonParse;
				res.count = results.length;
				res.Status = 200;
				res.Message = "Found " + results.length + " Unique product types";
				console.log("Rabbit Backend: search unique productTypes  count:"+ results.length );
			}
			else {    
				res.Message = "End of search result";
				console.log("End of search result");
			}
			callback(null, res);
		}  
	},query);
}; 	// end handle_request_getUniqueProductTypes

exports.handle_request_getUniqueProducts = function (msg, callback){
	var res = {};
	console.log("In handle_request_getUniqueProducts:");

	var query = "SELECT DISTINCT name FROM product";
	console.log("Query is:"+ query);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				res.products = jsonParse;
				res.count = results.length;
				res.Status = 200;
				res.Message = "Found " + results.length + " Unique products";
				console.log("Rabbit Backend: search unique products  count:"+ results.length );
			}
			else {    
				res.Message = "End of search result";
				console.log("End of search result");
			}
			callback(null, res);
		}  
	},query);
}; 	// end handle_request_getUniqueProducts

exports.handle_request_applyDPForProductType = function (msg, callback){
	var res = {};
	console.log("In handle_request_applyDPForProductType:");
	var productType = msg.productType;
	var mul = 1+ ((msg.percentage)/100);
	var query = "UPDATE product_test p SET p.price = p.price * " +  mul +  "where product_type = " + '"' + productType + '";';
	console.log("Query is:"+ query);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			console.log("Dynamic Pricing applied for product type " + productType);
			res.Status = 200;
			res.Message = "Dynamic Pricing applied for product type " + productType;
			callback(null, res);
		}  
	},query);
}; 	// end handle_request_applyDPForProductType

exports.handle_request_applyDPForProduct = function (msg, callback){
	var res = {};
	console.log("In handle_request_applyDPForProduct:");
	var product = msg.product;
	var mul = 1+ ((msg.percentage)/100);
	var query = "UPDATE product_test p SET p.price = p.price * " +  mul +  "where name = " + '"' + product + '";';
	console.log("Query is:"+ query);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			console.log("Dynamic Pricing applied for product  " + product);
			res.Status = 200;
			res.Message = "Dynamic Pricing applied for product  " + product;
			callback(null, res);
		}  
	},query);
}; 	// end handle_request_applyDPForProduct

//// *******    end  admin Dynamic Pricing module  ******** /////