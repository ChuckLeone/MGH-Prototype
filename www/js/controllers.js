app.controller('AccountCtrl', [
	'$scope',
	'$location',
	'$ionicLoading',
	'identity',
	'cities',
	'$ionicViewService',
	'$ionicPopover',
function($scope, $location, $ionicLoading, Identity, Cities, $ionicViewService, $ionicPopover) {
	// TODO: find a better way to do this
	var signedIn = Identity.isSignedIn();
	if(!signedIn && Identity.getCityId() == null)
	{
		$location.path('/tab/choose-city');
	}

	$scope.$root.tabsHidden = signedIn ? '' : 'tabs-hidden';

	var cityId = Identity.getCityId();
	$scope.identity = Identity;
	$scope.profile = Identity.getProfileInfo();
	$scope.badLogin = false;
	$scope.cities = Cities.all();

	$scope.signOut = function() {
		Identity.signOut();
		// this is a bit of a hack so the page refreshes and the tabs disappear
		$location.path('/tab/view-bill');
	};

	if (cityId !== null)
	{
		$scope.city = Cities.getCity(cityId);
	}
	else
	{
		$scope.city = null;
	}


	var showLoading = function() {
		$ionicLoading.show({
			template: '<i class="icon ion-refreshing"></i> Logging in...'
		});
	};

	var loginFailure = function(message) {
		$scope.badLogin = message;
	};

	var loginSuccess = function () {
		$ionicViewService.clearHistory();
		$location.path('/tab/view-bill');
	};

	$scope.doLogin = function(user) {
		//showLoading();
	    Identity.signIn(user, loginFailure, loginSuccess, $ionicLoading.hide);
	    //loginSuccess();
	    $location.path('/tab/view-bill');
	};

}])

.controller('ChooseCityCtrl', [
	'$scope',
	'cities',
	'identity',
	'api',
    '$location',
function ($scope, Cities, Identity, Api, $location) {
    $scope.$root.hideNavBar = true;
    $scope.cities = Cities.all();

    var signedIn = Identity.isSignedIn();
    if (!signedIn && Identity.getCityId() == null) {
        $location.path('/tab/choose-city');
    }

    $scope.$root.tabsHidden = signedIn ? '' : 'tabs-hidden';

    $scope.chooseCity = function (id) {
        $location.path('/tab/account');
		Identity.setCityId(id);
		Api.setDomain(id);
	}
}])

.controller('BillCtrl', [
	'$scope',
	'$ionicLoading',
	'identity',
	'bill',
	'$location',
	'payment',
	'cities',
	'$state',
function($scope, $ionicLoading, Identity, Bill, $location, Payment, Cities, $state) {

	// TODO: find a better way to do this
	if(!Identity.isSignedIn())
	{
		$location.path('/tab/account');
		return;
	}
	$scope.$root.tabsHidden = '';
	$scope.data = {};

	$scope.payBill = function(payUrl) {
		$location.path('/tab/pay-bill');
	};

	$scope.identity = Identity;
	$ionicLoading.show({
		template: '<i class="icon ion-refreshing"></i> Grabbing your latest bill...'
	});

	// If our session times out, we can still be "isSignedIn" but unable
	// to get results from the api
	var failureCallback = function() {
		Identity.signOut();
		$location.path('/tab/account');
	};

	$scope.customerSettings = { enablePropertyTax: true, enableUtility: true };
	Bill.getBillingData($scope.data, failureCallback, $ionicLoading.hide);

	$scope.hasReceipt = function(type, id) {
		return Bill.accountHasReceipt(type, id);
	};

	$scope.pay = function(propertyName, accountType, amount, propertyId) {

		var paymentSuccess = function() {
			$state.go('tab.receipt', { accountType: accountType, propertyId: propertyId });
			Bill.applyPayment(accountType, amount, propertyId);

		}

		var paymentHandler = Payment.getHandler(paymentSuccess);
		var newAmount = Math.round(amount * 100);
		paymentHandler.open({
			name: Cities.getCity(Identity.getCityId()).displayName,
			description: propertyName + " payment $" + amount,
			amount: newAmount
		});
    };

    //$scope.pay = function() {
    //    $location.path('/payment');
    //};
}])

.controller('ReceiptCtrl', [
	'$scope',
	'bill',
	'$state',
	'identity',
	'$stateParams',
function ($scope, Bill, $state, Identity, $stateParams) {

    $scope.date = new Date();

	// TODO: find a better way to do this
	if(!Identity.isSignedIn())
	{
		$state.go('tab.account');
		return;
	}
	$scope.$root.tabsHidden = '';
	var billData = Bill.getBillData();

	$scope.oldBalance = 0;

	var accountType = $stateParams.accountType;
	var propertyId = $stateParams.propertyId;

	for(var i = 0; i < billData.receipts[accountType][propertyId].length; i++)
	{
		$scope.oldBalance += billData.receipts[accountType][propertyId][i];
	}

	$scope.typeDisplayName = (accountType == 'taxProperty') ? 'Tax Property' : 'Utility';
	$scope.oldBalance += billData[accountType + 'Balance'];
	$scope.payments = billData.receipts[accountType][propertyId];
	$scope.balance = billData[accountType + 'Balance'];
	$scope.back = function() {
		$state.go('tab.view-bill');
	};
}]);
