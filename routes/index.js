var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
	res.render('index', {
		title: 'Express'
	});
});
router.get('/test', function (req, res) {

	res.json({
		msg: "Hello, worlds"
	});
});

module.exports = router;
