/* vim:set noexpandtab ts=4 sts=4 sw=4 : */

var App = (function () {
	var express = require('express');
	var app = express();
	var bodyParser = require('body-parser');
	app.use(bodyParser());
	var path = require('path');
	app.use(express.static(path.join(__dirname, 'public')));
	var mongoose = require('mongoose');
	var mongo_uri = "";
	if (app.get('env') === 'development') {
		mongo_uri = "mongodb://127.0.0.1";
	} else {
		mongo_uri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL;
	}
	console.log("connect db : " + mongo_uri);
	mongoose.connect(mongo_uri + '/benten3');

	var Order = require('./models/order');

	var router = express.Router();

	router.use(function (req, res, next) {
		console.log(req.url);
		next();
	});

	router.get("/", function (req, res) {
		res.jsonp({
			message: "Hello, API"
		});
	});

	function templating(src, data) {
		var str = src;
		var p1 = "__user__";
		var p2 = "__menu__";
		var p3 = "__price__";
		var p4 = "__total__";

		var total = 0;
		for (var i = 0; i < data.length; i++) {
			str = str.replace(p1, data[i].user);
			str = str.replace(p2, data[i].menu);
			str = str.replace(p3, data[i].price);
			total += data[i].price;
		}
		str = str.replace(new RegExp(p1, "g"), "");
		str = str.replace(new RegExp(p2, "g"), "");
		str = str.replace(new RegExp(p3, "g"), "");
		str = str.replace(p4, total);

		return str;
	}

	function getExcel(res, orders) {
		var fs = require("fs");
		fs.readFile("template/tyumon_sheet.xml", "utf8", function (err, data) {
			if (err) {
				console.log(err);
			}
			var str = templating(data, orders);
			res.send(str);
		});
	}


	router.route('/orders')
		.post(function (req, res) {
			var order = new Order();
			order.menu = req.body.menu;
			order.user = req.body.user;
			order.price = req.body.price;
			order.date = new Date(req.body.date);

			order.save(function (err) {
				if (err) {
					res.send(err);
				}
				res.jsonp({
					message: "Order created!"
				});
			});
		})
		.get(function (req, res) {
			if (req.query.date) {
				var d = new Date(new Date(parseInt(req.query.date, 10)));
				Order.find().where("date").equals(d).exec(function (err, orders) {
					if (err) {
						res.send(err);
					}

					if (req.query.format && req.query.format === "excel") {
						res.header("Content-Type",
							"application/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
						);
						res.header('Content-disposition', 'attachment; filename=orders.xml');
						getExcel(res, orders);
					} else {
						res.jsonp(orders);
					}
				});
			} else {
				Order.find(function (err, orders) {
					if (err) {
						res.send(err);
					}
					res.jsonp(orders);
				});

			}

		});

	router.route("/orders/:order_id")
		.get(function (req, res) {
			Order.findById(req.params.order_id, function (err, order) {
				if (err) {
					res.send(err);
				}
				res.jsonp(order);

			});
		})
		.put(function (req, res) {
			Order.findById(req.params.order_id, function (err, order) {
				if (err) {
					res.send(err);
				}
				order.menu = req.body.menu;
				order.user = req.body.user;
				order.price = req.body.price;
				order.date = new Date(req.body.date);

				order.save(function (err) {
					if (err) {
						res.send(err);
					}
					res.jsonp({
						message: 'order updated!'
					});
				});
			});
		})
		.delete(function (req, res) {
			Order.remove({
				_id: req.params.order_id
			}, function (err) {
				if (err) {
					res.send(err);
				}
				res.jsonp({
					message: "Succesfully deleted!"
				});
			});
		});

	app.use('/api', router);
	return app;
})();

module.exports = App;
