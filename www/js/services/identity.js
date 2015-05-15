app.factory('identity', [
	'$http',
	'cities',
	'api',
function($http, Cities, Api) {
	var baseServiceUrl = "http://{domain}.mygovhub.com/api/";
	var loginPath = "profile/login";
	var billPath = "Profile/DashboardView";

	var identity = {
		authorized: false,
		authCookie: null,
		cityId: null,
		email: null,
		firstName: null,
		lastName: null,
		userId: null
	};

	var loginSuccessHandler = function(data, status, headers, config){
		identity.authorized = true;
		identity.authCookie = true;
		identity.firstName = 'John';
		identity.lastName =	'Doe';
		identity.email = 'jdoe@email.com';
	};

	return {
		isSignedIn: function() {
			return identity.authorized;
		},
		signOut: function() {
			// we leave city alone so we can re login
			identity.authorized = false;
			identity.authCookie = null;
			userName = null;
		},
		signIn: function(user, failureCallback, successCallback, callback) {
			loginUrl = Api.getLoginUrl();
				loginSuccessHandler();
				successCallback();

		},
		setCityId: function(cityId) {
			identity.cityId = cityId;
		},
		getUserName: function() {
			return identity.userName;
		},
		getCityId: function() {
			return identity.cityId;
		},
		getProfileInfo: function() {
			return {
				firstName: identity.firstName,
				lastName: identity.lastName,
				email: identity.email
			}
		}
	};
}]);
