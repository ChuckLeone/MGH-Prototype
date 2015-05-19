app.factory('payment', function() {
	var handler = null;

	return {
	    getHandler: function (successCallback) {

	        if (handler == null)
	        {
				handler = StripeCheckout.configure({
					key: 'pk_test_6pRNASCoBOKtIshFeQd4XMUh',
					image: '/square-image.png',
					token: function (token) {    
						// Use the token to create the charge with a server-side script.
						// You can access the token ID with `token.id`
						console.log("Payment token:", token);
						successCallback();
					}
				});
				console.log("after the handler event!");
			}
			return handler;
		},
		closeHandler: function() {
			if(handler !== null)
			{
				handler.close();
			}

			handler = null;
		}
	};
});
