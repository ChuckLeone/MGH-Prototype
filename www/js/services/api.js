app.factory('api', ['cities', function(Cities){
	//baseDomain is replaced automatically when we build based on
	//the value of environment variable TARGET.
	//see hooks and config top level dirs for more
	var baseDomain = /*REP*/ '{subdomain}.mygovhub.com' /*REP*/;
	var baseServiceUrl = "http://{domain}/api/".replace('{domain}', baseDomain);
	var loginPath = "profile/login";
	var billPath = "Profile/DashboardView";

	var data = {
		domain: null
	};

	var _buildBaseUrl = function() {
		return baseServiceUrl.replace("{subdomain}", data.domain);
	};

	return {
		setDomain: function(cityId) {
			data.domain = Cities.getCityDomain(cityId);
		},
		getLoginUrl: function() {
			return _buildBaseUrl() + loginPath;
		},
		getBillUrl: function() {
			return _buildBaseUrl() + billPath;
		}
	};
}]);
