app.factory('cities', function() {
	var cities = {};

	//TODO: this list will come from the API. This is what a response looks like.
	//http://dev.mygovhub.com/api/customer/all
	var cityList = [
		{"id":"d999cfgh-806b-e411-826b-bc9a78563412","displayName":"Buffalo","link":"http://intcustomer1.mygovhub.com/","subdomain": /*REP*/ "intcustomer1" /*REP*/},
		{"id":"thdhcfdf-806b-e411-826b-bc9a78563412","displayName":"Niagara Falls","link":"http://democustomer1.viserys.mygovhub.com/","subdomain":/*REP*/ "intcustomer1" /*REP*/}
	];

	for(var i = 0; i < cityList.length; i++)
	{
		var city = cityList[i];
		cities[city["id"]] = city;
	}

	return {
		all: function() {
			return cities;
		},
		getCity: function(id) {
			return cities[id];
		},
		getCityDomain: function(id) {
			return cities[id].subdomain;
		}
	}
});
