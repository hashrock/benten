/* jshint unused: false */
angular.module('app', ["ngResource"]);

function Ctrl($scope, $resource, $http) {
	function checkSend() {
		if ($scope.date &&
			$scope.menu.name &&
			$scope.user) {
			return true;
		}
		return false;
	}

	function getJustDate(date) {
		var justDate = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate()
		);
		return justDate;
	}
	var Order = $resource("/api/orders/:id", {
		id: '@_id'
	});
	$scope.message = "";
	$scope.date = getJustDate(new Date());

	$scope.dateList = _.range(8).map(function (item) {
		var now = new Date();
		return new Date(now.getFullYear(), now.getMonth(), now.getDate() + item).getTime();
	}).filter(function (time) {
		var d = new Date(time).getDay();
		return (d !== 0) && (d !== 6);
	});

	function searchByDate(justDate) {
		return Order.query({
			date: justDate.getTime()
		});
	}


	$scope.reload = function () {
		var nowDate = new Date();
		var justDate = getJustDate(nowDate);
		$scope.orderSet = _.range(8).map(function (item) {
			var d = new Date(justDate.getTime());
			d.setDate(d.getDate() + item);
			return {
				orders: searchByDate(d),
				date: d.getTime()
			};
		}).filter(function (item) {
			var d = new Date(item.date).getDay();
			return (d !== 0) && (d !== 6);
		});

	};

	$scope.showOrderDialog = function (date) {
		console.log(date);
		$('#myModal').modal();
		$scope.date = date;
	};

	$scope.reload();

	function filterMenus(item) {
		if ($scope.date) {
			var nowDate = new Date();
			var orderDate = new Date($scope.date);

			var diffHours = (orderDate.getTime() - nowDate.getTime()) / 1000 / 60 / 60;

			//１日前かつ17:00以前なら無印注文可能
			if (item.kind === undefined && diffHours > (24 - 17)) {
				return true;
			}
			//１日前かつ13:00以前ならヘルシー注文可能
			if (item.kind === 'preorder' && diffHours > (24 - 13.5)) {
				return true;
			}
		}
		return false;
	}

	var menus = [];
	$http.get("/users.json").success(function (data) {
		$scope.users = data;
	});


	function updateMenus() {
		$scope.menus = menus.filter(filterMenus);
	}


	$http.get("/menu.json").success(function (data) {
		menus = data;
		updateMenus();
	});

	$scope.$watch("date", function () {
		updateMenus();
	});

	$scope.removeOrder = function (index, col) {
		var oid = col[index]._id;
		var order = new Order({
			_id: oid
		});
		if (confirm("以下の注文を削除しますか？" + col[index].user + " - " + col[index].menu)) {
			order.$delete(function () {
				$scope.reload();
			});
		}
	};

	$scope.clear = function () {
		$scope.user = "";
		$scope.menu = "";
		$scope.date = "";
		$scope.price = "";
	};

	$scope.sendOrder = function () {
		if (checkSend()) {
			$('#myModal').modal('hide');
			var order = new Order({
				user: $scope.user,
				menu: $scope.menu.name,
				date: $scope.date,
				price: $scope.menu.price
			});
			order.$save(function () {
				$scope.reload();
				$scope.clear();
			});
		} else {
			alert("必須項目が入力されていません。");
		}
	};
}
